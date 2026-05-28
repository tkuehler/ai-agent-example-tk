const PINECONE_API = 'https://api.pinecone.io';

function getApiKey(): string {
  const key = process.env.PINECONE_API_KEY;
  if (!key) throw new Error('PINECONE_API_KEY is not set');
  return key;
}

// Pinecone assistant names: lowercase alphanumeric + hyphens, max 45 chars
function toAssistantName(tenantId: string): string {
  const sanitized = tenantId
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return `randi-${sanitized}`.slice(0, 45);
}

async function request(method: string, path: string, body?: unknown) {
  const res = await fetch(`${PINECONE_API}${path}`, {
    method,
    headers: {
      'Api-Key': getApiKey(),
      'Content-Type': 'application/json',
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw new Error(`Pinecone ${res.status}: ${JSON.stringify(data)}`);
  return data;
}

async function uploadRequest(assistantName: string, buffer: Buffer, filename: string, mimeType: string) {
  const formData = new FormData();
  // Use Uint8Array to satisfy the BlobPart type (Buffer shares the underlying ArrayBuffer)
  const blob = new Blob([new Uint8Array(buffer)], { type: mimeType });
  formData.append('file', blob, filename);

  const res = await fetch(`${PINECONE_API}/assistant/files/${assistantName}`, {
    method: 'POST',
    headers: { 'Api-Key': getApiKey() },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Pinecone upload ${res.status}: ${JSON.stringify(data)}`);
  return data;
}

export async function getOrCreateAssistant(tenantId: string, instructions?: string): Promise<void> {
  const name = toAssistantName(tenantId);

  try {
    await request('GET', `/assistant/assistants/${name}`);
    return; // already exists
  } catch {
    // fall through to create
  }

  await request('POST', '/assistant/assistants', {
    name,
    instructions: instructions ?? 'Answer questions accurately and helpfully based on the provided documents.',
    metadata: { tenantId },
  });

  console.log(`[pinecone] Created assistant for tenant: ${tenantId} (${name})`);
}

export interface KnowledgeFile {
  id: string;
  name: string;
  size: number;
  created_on: string;
  status: string;
}

export async function uploadFile(
  tenantId: string,
  buffer: Buffer,
  filename: string,
  mimeType: string,
): Promise<{ id: string; name: string }> {
  await getOrCreateAssistant(tenantId);
  const name = toAssistantName(tenantId);
  const result = await uploadRequest(name, buffer, filename, mimeType);
  console.log(`[pinecone] Uploaded "${filename}" for tenant ${tenantId}`);
  return { id: result.id, name: result.name };
}

export async function listFiles(tenantId: string): Promise<KnowledgeFile[]> {
  const name = toAssistantName(tenantId);
  try {
    const result = await request('GET', `/assistant/files/${name}`);
    return result?.files ?? [];
  } catch {
    return [];
  }
}

export async function deleteFile(tenantId: string, fileId: string): Promise<void> {
  const name = toAssistantName(tenantId);
  await request('DELETE', `/assistant/files/${name}/${fileId}`);
  console.log(`[pinecone] Deleted file ${fileId} for tenant ${tenantId}`);
}

// Returns the assistant's grounded answer to use as RAG context for Claude.
// Returns null if no knowledge base exists or the query fails.
export async function queryKnowledgeBase(tenantId: string, question: string): Promise<string | null> {
  if (!process.env.PINECONE_API_KEY) return null;

  const name = toAssistantName(tenantId);

  try {
    const result = await request('POST', `/assistant/chat/${name}`, {
      messages: [{ role: 'user', content: question }],
      stream: false,
    });

    const content = result?.message?.content;
    if (!content) return null;

    console.log(`[pinecone] Knowledge base context retrieved for tenant ${tenantId}`);
    return content as string;
  } catch (error) {
    // Silently skip — assistant may not exist yet or have no relevant files
    console.log(`[pinecone] No KB context for tenant ${tenantId}:`, (error as Error).message);
    return null;
  }
}

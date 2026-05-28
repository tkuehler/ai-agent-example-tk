// src/pinecone/client.ts — Pinecone Assistant knowledge base
// Direct REST calls against the confirmed data-plane host.

const HOST      = process.env.PINECONE_API_HOST      || 'prod-1-data.ke.pinecone.io';
const ASSISTANT = process.env.PINECONE_ASSISTANT_NAME || 'randi-kb';

function apiKey(): string { return process.env.PINECONE_API_KEY || ''; }

function assistantName(tenantId?: string): string {
  if (tenantId && process.env.PINECONE_PER_TENANT === 'true') {
    return `randi-${tenantId.slice(0, 8)}`;
  }
  return ASSISTANT;
}

/**
 * Query Pinecone Assistant for knowledge relevant to the user's message.
 * Returns plain-text context (empty string if unavailable or no match).
 */
export async function queryKnowledge(query: string, tenantId?: string): Promise<string> {
  const key = apiKey();
  if (!key || !query.trim()) return '';

  const name = assistantName(tenantId);

  try {
    const res = await fetch(
      `https://${HOST}/assistant/chat/${name}`,
      {
        method:  'POST',
        headers: {
          'Api-Key':      key,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: query }],
        }),
      }
    );

    if (!res.ok) {
      // 404 = assistant has no files yet — not an error worth logging loudly
      if (res.status === 404) return '';
      const err = await res.text().catch(() => String(res.status));
      console.warn(`[pinecone] ${res.status}: ${err.slice(0, 120)}`);
      return '';
    }

    const data    = await res.json() as { message?: { content?: string } };
    const content = data?.message?.content || '';
    if (!content) return '';

    console.log(`[pinecone] KB: ${content.length} chars for "${query.slice(0, 50)}"`);
    return content;
  } catch (err) {
    console.warn('[pinecone] queryKnowledge failed (non-fatal):', (err as Error).message);
    return '';
  }
}

// src/pinecone/client.ts — Pinecone Assistant knowledge base client
import { Pinecone } from '@pinecone-database/pinecone';

let _pc: Pinecone | null = null;

function getPinecone(): Pinecone {
  if (!_pc) _pc = new Pinecone({ apiKey: process.env.PINECONE_API_KEY || '' });
  return _pc;
}

function assistantName(tenantId?: string): string {
  if (tenantId) return `randi-${tenantId.slice(0, 8)}`;
  return process.env.PINECONE_ASSISTANT_NAME || 'randi-kb';
}

/**
 * Query Pinecone Assistant for knowledge relevant to the message.
 * Returns a plain-text context string (empty if unavailable or no match).
 */
export async function queryKnowledge(query: string, tenantId?: string): Promise<string> {
  if (!process.env.PINECONE_API_KEY || !query.trim()) return '';

  const name = assistantName(tenantId);

  try {
    const assistant = getPinecone().assistant(name);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response  = await (assistant as any).chat({
      messages: [{ role: 'user', content: query }],
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const content = (response as any)?.message?.content as string | undefined;
    if (!content) return '';

    console.log(`[pinecone] KB: ${content.length} chars for "${query.slice(0, 50)}"`);
    return content;
  } catch (err) {
    // Assistant doesn't exist yet (no PDFs uploaded) — non-fatal
    console.warn('[pinecone] queryKnowledge failed (non-fatal):', (err as Error).message);
    return '';
  }
}

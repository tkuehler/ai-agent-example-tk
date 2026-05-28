// src/sendblue/client.ts — Sendblue API helpers
// Docs: https://docs.sendblue.com
'use strict';

const SENDBLUE_API = 'https://api.sendblue.com/api';

function auth(): Record<string, string> {
  return {
    'sb-api-key-id':     process.env.SENDBLUE_API_KEY_ID     || '',
    'sb-api-secret-key': process.env.SENDBLUE_API_SECRET_KEY || '',
    'Content-Type':      'application/json',
  };
}

function truncateError(text: string, max = 120): string {
  if (text.includes('<!DOCTYPE') || text.includes('<html')) return '[HTML error page]';
  return text.length > max ? text.slice(0, max) + '...' : text;
}

// ─── Send ─────────────────────────────────────────────────────────────────────

/**
 * Send a text message (optionally with a media attachment) via Sendblue.
 * Long messages (> 1500 chars) are automatically split into numbered chunks.
 */
export async function sendMessage(to: string, text: string, mediaUrl?: string): Promise<void> {
  if (!text && !mediaUrl) return;

  const MAX = 1500;
  const chunks = text && text.length > MAX
    ? text.match(new RegExp(`.{1,${MAX}}`, 'g')) || [text]
    : [text || ''];

  for (let i = 0; i < chunks.length; i++) {
    const prefix  = chunks.length > 1 ? `(${i + 1}/${chunks.length}) ` : '';
    const content = prefix + chunks[i];
    const isLast  = i === chunks.length - 1;

    const payload: Record<string, string> = {
      number:      to,
      from_number: process.env.SENDBLUE_PHONE_NUMBER || '',
      content,
    };
    if (isLast && mediaUrl) payload.media_url = mediaUrl;

    const res = await fetch(`${SENDBLUE_API}/send-message`, {
      method:  'POST',
      headers: auth(),
      body:    JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.text().catch(() => String(res.status));
      throw new Error(`Sendblue sendMessage failed (${res.status}): ${truncateError(err)}`);
    }

    const data = await res.json() as { message_handle?: string };
    console.log(`[sendblue] Sent to ${to}: ${data.message_handle || 'ok'}`);
  }
}

// ─── Typing indicator ─────────────────────────────────────────────────────────

export async function startTyping(to: string): Promise<void> {
  try {
    const res = await fetch(`${SENDBLUE_API}/send-typing-indicator`, {
      method:  'POST',
      headers: auth(),
      body:    JSON.stringify({ number: to }),
    });
    if (!res.ok) {
      const err = await res.text().catch(() => String(res.status));
      console.warn(`[sendblue] startTyping failed (non-fatal): ${truncateError(err)}`);
    }
  } catch (err) {
    console.warn('[sendblue] startTyping error (non-fatal):', err);
  }
}

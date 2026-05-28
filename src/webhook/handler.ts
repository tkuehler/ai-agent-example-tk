import { Request, Response } from 'express';
import { SendblueWebhookBody, parseSendblueWebhook } from './types.js';

export interface MessageHandler {
  (from: string, text: string, mediaUrl: string | null): Promise<void>;
}

export function createWebhookHandler(onMessage: MessageHandler) {
  // ALLOWED_SENDERS: comma-separated list of numbers to respond to (dev mode gate)
  const allowedSenders = process.env.ALLOWED_SENDERS
    ?.split(',').map(s => s.trim()).filter(Boolean) || [];
  // IGNORED_SENDERS: comma-separated numbers to never respond to
  const ignoredSenders = process.env.IGNORED_SENDERS
    ?.split(',').map(s => s.trim()).filter(Boolean) || [];

  return async (req: Request, res: Response): Promise<void> => {
    // Acknowledge receipt immediately so Sendblue doesn't retry
    res.status(200).json({ received: true });

    const body = req.body as SendblueWebhookBody;
    const msg  = parseSendblueWebhook(body);

    const ts = new Date().toLocaleString('en-US', { timeZone: 'America/Chicago', hour12: false });
    console.log(`[webhook] ${ts} | from=${msg.from} outbound=${msg.isOutbound}`);

    // Skip our own outgoing messages
    if (msg.isOutbound) return;

    if (!msg.from) {
      console.warn('[webhook] Missing from_number — skipping');
      return;
    }

    // Sender allow/deny lists
    if (ignoredSenders.includes(msg.from)) {
      console.log(`[webhook] Ignoring ${msg.from} (in IGNORED_SENDERS)`);
      return;
    }
    if (allowedSenders.length > 0 && !allowedSenders.includes(msg.from)) {
      console.log(`[webhook] Skipping ${msg.from} (not in ALLOWED_SENDERS)`);
      return;
    }

    if (!msg.text && !msg.mediaUrl) {
      console.log(`[webhook] Empty message from ${msg.from} — skipping`);
      return;
    }

    console.log(`[webhook] "${msg.text.substring(0, 80)}"${msg.mediaUrl ? ' [+media]' : ''}`);

    try {
      await onMessage(msg.from, msg.text, msg.mediaUrl);
    } catch (err) {
      console.error('[webhook] Handler error:', err);
    }
  };
}

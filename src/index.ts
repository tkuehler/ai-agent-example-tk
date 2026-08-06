import 'dotenv/config';
import express from 'express';
import { createWebhookHandler } from './webhook/handler.js';
import { sendMessage, startTyping } from './sendblue/client.js';
import { chat } from './claude/client.js';
import { queryKnowledge } from './pinecone/client.js';
import { isBlocked, recordOffTopic } from './state/blocklist.js';
import { isOffTopic } from './moderation/offtopic.js';

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const WARN_MESSAGES: Record<number, string> = {
  1: "Hey — I'm Randi, a service assistant for equipment troubleshooting, parts, and warranty questions. That's outside what I can help with.\n\nIf you have a service question, I'm here for it.\n\n⚠️ Warning 1 of 3 — your number will be blocked after 3 off-topic messages.",
  2: "Still not something I can help with. Randi is for equipment service only — troubleshooting, parts, and warranty.\n\n⚠️ Warning 2 of 3 — one more off-topic message and this number will be blocked.",
};

const BLOCK_MESSAGE =
  "This number has been blocked. Randi is a service-only assistant for equipment troubleshooting, parts, and warranty questions.\n\nFor service help, contact your equipment dealer directly.";

// Sendblue webhook
app.post(
  '/webhook',
  createWebhookHandler(async (from, text, mediaUrl) => {
    const start = Date.now();
    console.log(`[main] Message from ${from}`);

    // ── Bot protection: silently drop blocked numbers ────────────────────────
    if (await isBlocked(from)) {
      console.log(`[main] Dropping message from blocked number ${from}`);
      return;
    }

    // ── Off-topic / payment detection ────────────────────────────────────────
    if (isOffTopic(text)) {
      console.log(`[main] Off-topic message from ${from}: "${text.substring(0, 60)}"`);
      const { count, blocked } = await recordOffTopic(from);

      if (blocked) {
        await sendMessage(from, BLOCK_MESSAGE);
        console.log(`[main] Blocked ${from} after ${count} off-topic messages`);
      } else {
        const warn = WARN_MESSAGES[count] ?? WARN_MESSAGES[2];
        await sendMessage(from, warn);
      }
      return;
    }

    // ── Normal flow ──────────────────────────────────────────────────────────
    // Show typing indicator while working (non-blocking, best-effort)
    startTyping(from).catch(() => {});

    // Query Pinecone knowledge base for relevant context
    const knowledgeContext = await queryKnowledge(text).catch(() => '');
    if (knowledgeContext) {
      console.log(`[main] Pinecone context: ${knowledgeContext.length} chars`);
    }

    // Build image input if media was attached
    const images = mediaUrl ? [{ url: mediaUrl, mimeType: 'image/jpeg' }] : [];

    // Get Claude's response (keyed by sender phone number as chat ID)
    const { text: responseText, generatedImage } = await chat(from, text, images, knowledgeContext);
    console.log(`[timing] claude: ${Date.now() - start}ms`);

    if (responseText) {
      // Split on '---' for multi-message responses
      const messages = responseText
        .split('---')
        .map(m => m.trim())
        .filter(m => m.length > 0);

      for (let i = 0; i < messages.length; i++) {
        const isLast = i === messages.length - 1;
        // Attach generated image URL to the last message
        await sendMessage(from, messages[i], isLast && generatedImage ? generatedImage.url : undefined);
        if (!isLast) {
          // Brief pause between messages for natural feel
          await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 300));
        }
      }

      console.log(`[main] Sent ${messages.length} message(s) to ${from} in ${Date.now() - start}ms`);
    } else if (generatedImage) {
      // Image-only response
      await sendMessage(from, '', generatedImage.url);
      console.log(`[main] Sent generated image to ${from}`);
    } else {
      console.warn(`[main] No response to send to ${from}`);
    }
  })
);

// Start server
app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════╗
║        Sendblue <-> Claude (+ Pinecone KB)           ║
╠══════════════════════════════════════════════════════╣
║  http://localhost:${PORT}                               ║
║                                                      ║
║  POST /webhook  — Sendblue inbound messages          ║
║  GET  /health   — Health check                       ║
║                                                      ║
║  1. Expose with: ngrok http ${PORT}                     ║
║  2. Set webhook URL in Sendblue dashboard            ║
║  3. Set ALLOWED_SENDERS=+15129799088 for dev         ║
╚══════════════════════════════════════════════════════╝
  `);
});


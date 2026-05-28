import 'dotenv/config';
import express from 'express';
import { createWebhookHandler } from './webhook/handler.js';
import { sendMessage, startTyping } from './sendblue/client.js';
import { chat } from './claude/client.js';
import { queryKnowledge } from './pinecone/client.js';

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Sendblue webhook
app.post(
  '/webhook',
  createWebhookHandler(async (from, text, mediaUrl) => {
    const start = Date.now();
    console.log(`[main] Message from ${from}`);

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

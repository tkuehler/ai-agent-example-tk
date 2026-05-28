import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import {
  getConversation,
  addMessage,
  clearConversation,
  getUserProfile,
  setUserName,
  addUserFact,
  clearUserProfile,
  UserProfile,
  StoredMessage,
} from '../state/conversation.js';

const client = new Anthropic();
const openai  = new OpenAI();

// ─── System prompt ────────────────────────────────────────────────────────────

const BASE_SYSTEM_PROMPT = `You are Randi, an AI-powered industrial equipment troubleshooting assistant, accessible via SMS and iMessage.

Technicians and field engineers text you problems — a fault code, a description, a photo — and you help diagnose the issue, suggest next steps, and identify relevant parts and datasheets.

You have access to a knowledge base of equipment manuals, fault codes, and parts catalogs. When context from the knowledge base is included in your prompt, use it to give specific, accurate answers.

## Response style
You're texting — write like you're messaging a knowledgeable colleague, not writing a manual.

- Clear and direct — technicians need answers fast
- Short messages — 2-4 sentences unless a step-by-step is needed
- Use "---" to split into multiple messages for longer responses
- No markdown formatting (no bullets, headers, bold, numbered lists)
- Skip pleasantries when there's a problem to solve
- Metric and Imperial units — use both when relevant

## Commands (tell users if they ask)
- /clear — Reset conversation history
- /forget me — Erase everything you know about them

You can search the web for current information (recall dates, known recalls, spec sheets hosted online, etc.).
You can generate images when asked.
You can save facts about users with the remember_user tool to personalise future replies.`;

function buildSystemPrompt(knowledgeContext: string, senderProfile?: UserProfile | null, handle?: string): string {
  let prompt = BASE_SYSTEM_PROMPT;

  if (knowledgeContext) {
    prompt += `\n\n## Knowledge base context\nThe following was retrieved from the equipment knowledge base for this query:\n\n${knowledgeContext}`;
  }

  if (handle) {
    const profile = senderProfile;
    if (profile?.name || (profile?.facts && profile.facts.length > 0)) {
      prompt += `\n\n## About this technician (already saved — do NOT re-save)`;
      prompt += `\nHandle: ${handle}`;
      if (profile.name) prompt += `\nName: ${profile.name}`;
      if (profile.facts?.length) prompt += `\nKnown facts:\n- ${profile.facts.join('\n- ')}`;
    } else {
      prompt += `\n\n## About this technician\nHandle: ${handle}\nYou don't know their name yet.`;
    }
  }

  return prompt;
}

// ─── Tools ────────────────────────────────────────────────────────────────────

const REMEMBER_USER_TOOL: Anthropic.Tool = {
  name: 'remember_user',
  description: 'Save NEW information about a technician (name, employer, equipment they work on). Only use for genuinely new info — never re-save what is already in the system prompt. You MUST also write a text response.',
  input_schema: {
    type: 'object' as const,
    properties: {
      name: {
        type: 'string',
        description: "The person's name if they've shared it.",
      },
      fact: {
        type: 'string',
        description: 'A useful fact to remember (e.g., "Works on Bosch hydraulic pumps", "Based in Austin TX"). Keep it concise.',
      },
    },
  },
};

const GENERATE_IMAGE_TOOL: Anthropic.Tool = {
  name: 'generate_image',
  description: 'Generate an image using DALL-E. Use when asked to create, draw, or generate a picture. Also write a brief text message — it will be sent first so the user knows something is happening.',
  input_schema: {
    type: 'object' as const,
    properties: {
      prompt: {
        type: 'string',
        description: 'Detailed description of the image to generate.',
      },
    },
    required: ['prompt'],
  },
};

// Web search — uses a special type cast
const WEB_SEARCH_TOOL = {
  type: 'web_search_20250305',
  name: 'web_search',
} as unknown as Anthropic.Tool;

// ─── Response type ────────────────────────────────────────────────────────────

export interface ChatResponse {
  text: string | null;
  generatedImage: { url: string; prompt: string } | null;
}

export interface ImageInput {
  url:      string;
  mimeType: string;
}

// ─── Image generation ─────────────────────────────────────────────────────────

export async function generateImage(prompt: string): Promise<string | null> {
  try {
    const response = await openai.images.generate({
      model:   'dall-e-3',
      prompt,
      n:       1,
      size:    '1024x1024',
      quality: 'standard',
    });
    const url = response.data?.[0]?.url;
    if (url) {
      console.log(`[claude] Image generated: ${url.substring(0, 60)}...`);
      return url;
    }
    return null;
  } catch (err) {
    console.error('[claude] DALL-E error:', err);
    return null;
  }
}

// ─── Format conversation history ──────────────────────────────────────────────

function formatHistory(messages: StoredMessage[]): Anthropic.MessageParam[] {
  return messages.map(msg => ({ role: msg.role, content: msg.content }));
}

// ─── Main chat function ───────────────────────────────────────────────────────

export async function chat(
  chatId:           string,
  userMessage:      string,
  images:           ImageInput[]    = [],
  knowledgeContext: string          = '',
): Promise<ChatResponse> {
  const cmd = userMessage.toLowerCase().trim();

  // Built-in commands
  if (cmd === '/clear') {
    await clearConversation(chatId);
    return { text: 'conversation cleared 🧹', generatedImage: null };
  }
  if (cmd === '/forget me' || cmd === '/forgetme') {
    await clearUserProfile(chatId);
    return { text: "done — forgotten everything. we're strangers now", generatedImage: null };
  }
  if (cmd === '/help') {
    return { text: '/clear — reset history\n/forget me — erase what I know about you', generatedImage: null };
  }

  // Load history and sender profile
  const [history, senderProfile] = await Promise.all([
    getConversation(chatId),
    getUserProfile(chatId),
  ]);

  // Build message content
  const messageContent: Anthropic.ContentBlockParam[] = [];
  for (const img of images) {
    messageContent.push({ type: 'image', source: { type: 'url', url: img.url } });
  }
  const textToSend = userMessage.trim() || (images.length > 0 ? "What's in this image?" : '');
  if (textToSend) {
    messageContent.push({ type: 'text', text: textToSend });
  }

  if (textToSend) {
    await addMessage(chatId, 'user', textToSend);
  }

  const tools: Anthropic.Tool[] = [REMEMBER_USER_TOOL, GENERATE_IMAGE_TOOL, WEB_SEARCH_TOOL];

  const response = await client.messages.create({
    model:      'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system:     buildSystemPrompt(knowledgeContext, senderProfile, chatId),
    tools,
    messages:   [...formatHistory(history), { role: 'user', content: messageContent }],
  });

  // Parse response blocks
  const textParts:      string[] = [];
  let   generatedImage: { url: string; prompt: string } | null = null;

  for (const block of response.content) {
    if (block.type === 'text') {
      textParts.push(block.text);
    } else if (block.type === 'tool_use' && block.name === 'remember_user') {
      const input = block.input as { name?: string; fact?: string };
      let changed = false;
      if (input.name) { changed = await setUserName(chatId, input.name) || changed; }
      if (input.fact) { changed = await addUserFact(chatId, input.fact) || changed; }
      if (changed) console.log(`[claude] Updated profile for ${chatId}`);
    } else if (block.type === 'tool_use' && block.name === 'generate_image') {
      const input = block.input as { prompt: string };
      console.log(`[claude] Generating image: "${input.prompt.slice(0, 60)}..."`);
      const url = await generateImage(input.prompt);
      if (url) generatedImage = { url, prompt: input.prompt };
    }
  }

  const textResponse = textParts.length > 0 ? textParts.join('\n') : null;

  // Save to history
  if (textResponse) {
    const historyText = textResponse.split('---').map(m => m.trim()).filter(Boolean).join(' ');
    await addMessage(chatId, 'assistant', historyText);
  }

  return { text: textResponse, generatedImage };
}

/**
 * groq.js — Groq AI client helper
 *
 * Groq is OpenAI-compatible, so we use plain fetch against their API.
 * Model: llama-3.1-8b-instant  (free tier: 14,400 req/day, 30 req/min)
 *
 * Usage:
 *   import { groqChat } from '../config/groq.js';
 *   const text = await groqChat(systemPrompt, userPrompt, { temperature: 0.7, maxTokens: 600 });
 */

import { env } from './env.js';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL   = 'openai/gpt-oss-20b';

/**
 * Send a chat completion request to Groq.
 * Returns the response text string, or throws on failure.
 *
 * @param {string} systemPrompt
 * @param {string} userPrompt
 * @param {{ temperature?: number, maxTokens?: number }} opts
 * @returns {Promise<string>}
 */
export async function groqChat(systemPrompt, userPrompt, opts = {}) {
  const { temperature = 0.7, maxTokens = 800 } = opts;

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      temperature,
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt   }
      ]
    })
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(JSON.stringify(err));
  }

  const data = await response.json();
  const text = data?.choices?.[0]?.message?.content ?? '';
  return text.trim();
}

/** Returns true if a Groq API key is configured */
export const hasGroq = () => Boolean(env.GROQ_API_KEY);
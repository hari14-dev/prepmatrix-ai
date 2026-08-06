/**
 * streamText.js — Typewriter effect for AI responses (ChatGPT / Gemini style).
 * Supports cancellation signals and isStreaming state tracking per message.
 */
export async function streamText(text, onChunk, { baseDelay = 10, signal } = {}) {
  let out = '';
  for (let i = 0; i < text.length; i++) {
    if (signal?.aborted) break;
    out += text[i];
    onChunk(out);
    let d = baseDelay;
    if ('.!?'.includes(text[i]) && text[i + 1] === ' ') d = 45;
    else if (',;:'.includes(text[i])) d = 20;
    else if (text[i] === '\n') d = 25;
    await new Promise(r => setTimeout(r, d));
  }
}

export async function streamMessageInto(msgId, fullText, setMessages, { signal } = {}) {
  setMessages(prev => [...prev, { id: msgId, role: 'assistant', text: '', isStreaming: true }]);
  await streamText(fullText, partial => {
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, text: partial } : m));
  }, { signal });
  setMessages(prev => prev.map(m => m.id === msgId ? { ...m, isStreaming: false } : m));
}

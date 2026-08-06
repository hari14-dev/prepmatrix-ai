/**
 * streamText.js — Typewriter effect for AI responses.
 * Groq responses arrive all at once; we animate them character-by-character.
 */
export async function streamText(text, onChunk, { baseDelay = 11 } = {}) {
  let out = '';
  for (let i = 0; i < text.length; i++) {
    out += text[i];
    onChunk(out);
    let d = baseDelay;
    if ('.!?'.includes(text[i]) && text[i+1] === ' ') d = 55;
    else if (',;:'.includes(text[i])) d = 22;
    else if (text[i] === '\n') d = 30;
    await new Promise(r => setTimeout(r, d));
  }
}

export async function streamMessageInto(msgId, fullText, setMessages) {
  setMessages(prev => [...prev, { id: msgId, role: 'assistant', text: '' }]);
  await streamText(fullText, partial => {
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, text: partial } : m));
  });
}

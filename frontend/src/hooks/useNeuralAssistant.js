import { useRef, useState, useCallback } from 'react';
import { apiRequest } from '../lib/api.js';
import { streamMessageInto } from '../lib/streamText.js';
import { useAuth } from '../context/AuthContext.jsx';

export function useNeuralAssistant(problemContext, assistantPath = '/api/aptitude/ai-assistant') {
  const { token } = useAuth();
  const [messages, setMessages] = useState([
    {
      id: 'initial',
      role: 'assistant',
      text: 'Hi! I\'m your Neural Assistant. Ask me anything — for a hint, a full explanation, or the answer itself. I\'m here to help!'
    }
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const abortControllerRef = useRef(null);

  const stopGenerating = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsThinking(false);
  }, []);

  const askHint = async (userQuery) => {
    const query = userQuery.trim();
    if (!query || isThinking) {
      return;
    }

    // Stop any existing generation
    stopGenerating();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: 'user', text: query }]);
    setIsThinking(true);

    try {
      const chatHistory = messages.slice(-6).map(m => `${m.role === 'user' ? 'Student' : 'Assistant'}: ${m.text}`);
      const response = await apiRequest(assistantPath, {
        method: 'POST',
        token,
        body: {
          problemContext,
          userQuery: query,
          chatHistory
        }
      });

      if (controller.signal.aborted) return;

      await streamMessageInto(`a-${Date.now()}`, response.data.hint, setMessages, { signal: controller.signal });
    } catch (error) {
      if (controller.signal.aborted) return;
      setMessages((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          role: 'assistant',
          text: error instanceof Error ? error.message : 'Unable to fetch hint right now.'
        }
      ]);
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
        setIsThinking(false);
      }
    }
  };

  return {
    messages,
    isThinking,
    askHint,
    stopGenerating
  };
}
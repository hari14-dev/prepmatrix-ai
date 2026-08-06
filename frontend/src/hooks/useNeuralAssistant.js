import { useState } from 'react';
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

  const askHint = async (userQuery) => {
    const query = userQuery.trim();
    if (!query) {
      return;
    }

    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, role: 'user', text: query }]);
    setIsThinking(true);

    try {
      const response = await apiRequest(assistantPath, {
        method: 'POST',
        token,
        body: {
          problemContext,
          userQuery: query
        }
      });

      await streamMessageInto(`a-${Date.now()}`, response.data.hint, setMessages);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          role: 'assistant',
          text: error instanceof Error ? error.message : 'Unable to fetch hint right now.'
        }
      ]);
    } finally {
      setIsThinking(false);
    }
  };

  return {
    messages,
    isThinking,
    askHint
  };
}
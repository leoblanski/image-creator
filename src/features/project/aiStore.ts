import { create } from 'zustand';
import { AIResponse } from './models/AIResponse';

interface AIStore {
  isLoading: boolean;
  error: string | null;
  lastResponse: AIResponse | null;
  
  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setResponse: (response: AIResponse) => void;
  clearError: () => void;
  reset: () => void;
}

export const useAIStore = create<AIStore>((set) => ({
  isLoading: false,
  error: null,
  lastResponse: null,

  setLoading: (loading) => {
    set({ isLoading: loading });
  },

  setError: (error) => {
    set({ error, isLoading: false });
  },

  setResponse: (response) => {
    set({ lastResponse: response, isLoading: false, error: null });
  },

  clearError: () => {
    set({ error: null });
  },

  reset: () => {
    set({
      isLoading: false,
      error: null,
      lastResponse: null,
    });
  },
}));

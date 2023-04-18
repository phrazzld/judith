import { create } from "zustand";

type Store = {
  error: string | null;
  setError: (value: string | null) => void;
  mindReading: boolean;
  setMindReading: (value: boolean) => void;
  useAudio: boolean;
  setUseAudio: (value: boolean) => void;
};

export const useStore = create<Store>((set) => ({
  error: null,
  setError: (value: string | null) => set(() => ({ error: value })),
  mindReading: false,
  setMindReading: (value: boolean) => set(() => ({ mindReading: value })),
  useAudio: false,
  setUseAudio: (value: boolean) => set(() => ({ useAudio: value })),
}));

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { useStory } from './queries/stories';

const LAST_READ_KEY = 'last_read_story';

interface LastReadState {
  lastReadIndex: number | null;
  setLastRead: (index: number) => void;
  loadLastRead: () => Promise<void>;
}

async function getInitialLastRead(): Promise<number | null> {
  const value = await AsyncStorage.getItem(LAST_READ_KEY);
  return value ? Number(value) : null;
}

export const useLastReadStore = create<LastReadState>((set) => {
  getInitialLastRead().then((lastReadIndex) => {
    if (lastReadIndex !== null) {
      set({ lastReadIndex });
    }
  });

  return {
    lastReadIndex: null,
    setLastRead: (index: number) => {
      set({ lastReadIndex: index });
      AsyncStorage.setItem(LAST_READ_KEY, index.toString());
    },
    loadLastRead: async () => {
      const value = await AsyncStorage.getItem(LAST_READ_KEY);
      if (value) {
        set({ lastReadIndex: Number(value) });
      }
    },
  };
});
export function useLastReadStory() {
  const { lastReadIndex } = useLastReadStore();
  return useStory(lastReadIndex ?? -1, { enabled: lastReadIndex !== null });
}

import { getPersistentItem, removePersistentItem, setPersistentItem } from '@/data/persistent-storage';
import { create } from 'zustand';
import { useStory } from './queries/stories';

const LAST_READ_KEY = 'last_read_story';
let lastReadStorageQueue = Promise.resolve();
let lastReadMutationId = 0;

interface LastReadState {
  lastReadIndex: number | null;
  setLastRead: (index: number) => void;
  clearLastRead: (index?: number) => void;
  loadLastRead: () => Promise<void>;
}

async function getInitialLastRead(): Promise<number | null> {
  const value = await getPersistentItem(LAST_READ_KEY);
  return value ? Number(value) : null;
}

function queueLastReadStorageUpdate(update: () => Promise<void>) {
  lastReadStorageQueue = lastReadStorageQueue.then(update, update);
  return lastReadStorageQueue;
}

export const useLastReadStore = create<LastReadState>((set, get) => {
  const initialLoadMutationId = lastReadMutationId;

  getInitialLastRead().then((lastReadIndex) => {
    if (lastReadIndex !== null && initialLoadMutationId === lastReadMutationId) {
      set({ lastReadIndex });
    }
  });

  return {
    lastReadIndex: null,
    setLastRead: (index: number) => {
      lastReadMutationId += 1;
      set({ lastReadIndex: index });
      void queueLastReadStorageUpdate(() => setPersistentItem(LAST_READ_KEY, index.toString()));
    },
    clearLastRead: (index?: number) => {
      if (index !== undefined && get().lastReadIndex !== index) {
        return;
      }

      lastReadMutationId += 1;
      set({ lastReadIndex: null });
      void queueLastReadStorageUpdate(() => removePersistentItem(LAST_READ_KEY));
    },
    loadLastRead: async () => {
      await lastReadStorageQueue;
      const value = await getPersistentItem(LAST_READ_KEY);
      set({ lastReadIndex: value ? Number(value) : null });
    },
  };
});
export function useLastReadStory() {
  const { lastReadIndex } = useLastReadStore();
  return useStory(lastReadIndex ?? -1, { enabled: lastReadIndex !== null });
}

import { queryClient } from '@/data/query-client';
import { getPersistentItem, removePersistentItem, setPersistentItem } from '@/data/persistent-storage';
import { useQuery } from '@tanstack/react-query';
import { uniq } from 'lodash';
import { useStoriesByIndex } from './queries/stories';

const STORAGE_KEY = 'reading_progress';
const READING_PROGRESS_KEY = ['reading-progress'];

export const useReadingProgress = <TData = number[]>(
  options?: { select?: (indexes: number[]) => TData, enabled?: boolean }

) => {
  return useQuery({
    queryKey: READING_PROGRESS_KEY,
    queryFn: async (): Promise<number[]> => {
      const raw = await getPersistentItem(STORAGE_KEY);
      const stored: number[] = raw ? JSON.parse(raw) : [];
      return uniq(stored);
    },
    enabled: options?.enabled ?? true,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    select: options?.select,
  });

};

export const addReadIndex = async (index: number) => {
  queryClient.setQueryData(READING_PROGRESS_KEY, (old: number[] = []) => uniq([...old, index]));
  const old = await getPersistentItem(STORAGE_KEY);
  setPersistentItem(STORAGE_KEY, JSON.stringify(uniq((old ? JSON.parse(old) : []).concat(index))));
};

export const resetReadingProgress = async () => {
  queryClient.setQueryData<number[]>(READING_PROGRESS_KEY, []);
  await removePersistentItem(STORAGE_KEY);
};

export const useProgressPercent = () => {
  const { data: storiesByIndex } = useStoriesByIndex();
  const { data: readIndexes = [] } = useReadingProgress();

  const total = storiesByIndex?.size ?? 0;
  if (!total) { return 0; }

  const read = uniq(readIndexes).filter(idx => storiesByIndex?.has(idx)).length;
  return Math.round((read / total) * 100);
};

export const useIsRead = (index: number) => {
  const { data: isRead = false } = useReadingProgress({
    select: (indexes) => indexes.includes(index),
  });
  return isRead;
};

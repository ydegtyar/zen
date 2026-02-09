import { queryClient } from '@/app/data/query-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QueryObserverOptions, useQuery } from '@tanstack/react-query';
import { map, uniq } from 'lodash';
import { useStories } from './queries/stories';

const STORAGE_KEY = 'reading_progress';
const READING_PROGRESS_KEY = ['reading-progress'];

export const useReadingProgress = (
  options?: { select?: QueryObserverOptions<number[]>['select'], enabled?: boolean }

) => {
  const { data: stories = [], isLoading } = useStories();
  const indeces = map(stories, 'index');

  return useQuery({
    queryKey: READING_PROGRESS_KEY,
    queryFn: async (): Promise<number[]> => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      const stored: number[] = raw ? JSON.parse(raw) : [];
      const validIndexes = uniq(stored.filter((index) => indeces.includes(index)));
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(validIndexes));

      return validIndexes;
    },
    enabled: !isLoading && !!indeces.length && (options?.enabled ?? true),
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
  queryClient.setQueryData(READING_PROGRESS_KEY, (old: number[]) => uniq([...old, index]));
  const old = await AsyncStorage.getItem(STORAGE_KEY);
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(uniq((old ? JSON.parse(old) : []).concat(index))));
};

export const useProgressPercent = () => {
  const { data: stories = [] } = useStories();
  const { data: readIndexes = [] } = useReadingProgress();

  const total = stories.length;
  if (!total) { return 0; }

  const read = uniq(readIndexes).filter(idx => stories.some(s => s.index === idx)).length;
  return Math.round((read / total) * 100);
};

export const useIsRead = (index: number) => {
  const { data: readIndexes = [] } = useReadingProgress({
    select: (indexes) => indexes.filter((idx) => idx === index),
  });
  return readIndexes.includes(index);
};

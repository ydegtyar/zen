
import { QueryObserverOptions, useQuery } from '@tanstack/react-query';
import { fetchStories, Story } from '../fetch-stories';
import { Language, useLanguage } from '../language';

export function useStories(
  options?: { select?: QueryObserverOptions<Story[]>['select'], enabled?: boolean }
) {
  const { data: language, isLoading } = useLanguage();

  return useQuery({
    queryKey: ['stories', language],
    queryFn: () => fetchStories(language || Language.En),
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
    enabled: options?.enabled ?? (!isLoading && !!language),
    select: options?.select,
  });
}

export function useStory(index: number, options?: { enabled?: boolean }) {
  const query = useStories({
    select: (stories) => stories?.filter((s) => s.index === index),
    enabled: options?.enabled ?? index >= 0,
  });
  return { ...query, data: query.data?.[0] };
}
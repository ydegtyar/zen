
import { QueryObserverOptions, useQuery } from '@tanstack/react-query';
import { fetchStories } from '../fetch-stories';
import { Language, useLanguage } from '../language';
import { Story } from "../Story";

type StoriesData = {
  stories: Story[];
  storiesByIndex: Map<number, Story>;
};

const buildStoriesData = async (language: Language): Promise<StoriesData> => {
  const stories = await fetchStories(language);
  return {
    stories,
    storiesByIndex: new Map(stories.map((story) => [story.index, story])),
  };
};

function useStoriesData<TData = StoriesData>(
  options?: { enabled?: boolean, select?: (data: StoriesData) => TData }
) {
  const { data: language, isLoading } = useLanguage();

  return useQuery({
    queryKey: ['stories-data', language],
    queryFn: () => buildStoriesData(language || Language.En),
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

export function useStories(
  options?: { select?: QueryObserverOptions<Story[]>['select'], enabled?: boolean }
) {
  return useStoriesData({
    enabled: options?.enabled,
    select: (data) => {
      const stories = data.stories;
      return options?.select ? options.select(stories) : stories;
    },
  });
}

export function useStory(index: number, options?: { enabled?: boolean }) {
  const query = useStoriesData({
    enabled: options?.enabled ?? index >= 0,
    select: (data) => data.storiesByIndex.get(index),
  });
  return query;
}

export function useStoriesByIndex(options?: { enabled?: boolean }) {
  return useStoriesData({
    enabled: options?.enabled,
    select: (data) => data.storiesByIndex,
  });
}

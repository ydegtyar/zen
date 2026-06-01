import { queryClient } from '@/data/query-client';
import { i18n } from '@/data/i18n';
import { getPersistentItem, setPersistentItem } from '@/data/persistent-storage';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';

export enum Language {
  En = 'en',
  Uk = 'uk',
  Ru = 'ru'
}

const LANGUAGE_KEY = ['language'];
export const AVAILABLE_LANGUAGES: Language[] = [Language.En, Language.Ru, Language.Uk];
export const STORAGE_KEY = 'app_language';

export const useLanguage = () => {
  const query = useQuery({
    queryKey: LANGUAGE_KEY,
    queryFn: async (): Promise<Language> => {
      const lang = await getPersistentItem(STORAGE_KEY);
      if (lang && AVAILABLE_LANGUAGES.includes(lang as Language)) {
        return lang as Language;
      }
      return Language.En;
    },
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
  });

  useEffect(() => {
    if (query.data) {
      i18n.locale = query.data;
    }
  }, [query.data]);

  return query;
};

export const setLanguage = (lang: Language) => {
  if (queryClient.getQueryData(LANGUAGE_KEY) === lang) {
    return;
  }

  i18n.locale = lang;
  queryClient.setQueryData(LANGUAGE_KEY, lang);
  setPersistentItem(STORAGE_KEY, lang);
};

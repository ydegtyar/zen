import { queryClient } from '@/data/query-client';
import { getPersistentItem, setPersistentItem } from '@/data/persistent-storage';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useQuery } from '@tanstack/react-query';
import { Platform } from 'react-native';

export enum Theme {
  Auto = 'auto',
  Light = 'light',
  Dark = 'dark'
}


const THEME_KEY = ['theme'];
export const STORAGE_KEY = 'app_theme';
const DEFAULT_THEME = Platform.OS === 'web' ? Theme.Light : Theme.Auto;

export const useAppTheme = () => {
  const query = useQuery({
    queryKey: THEME_KEY,
    queryFn: async (): Promise<Theme> => {
      const savedTheme = await getPersistentItem(STORAGE_KEY);
      if (savedTheme && [Theme.Light, Theme.Dark, Theme.Auto].includes(savedTheme as Theme)) {
        return savedTheme as Theme;
      }
      return DEFAULT_THEME;
    },
    initialData: DEFAULT_THEME,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
    refetchIntervalInBackground: false,
  });

  return query;
};

export const setTheme = (theme: Theme) => {
  if (queryClient.getQueryData(THEME_KEY) === theme) {
    return;
  }

  queryClient.setQueryData(THEME_KEY, theme);
  setPersistentItem(STORAGE_KEY, theme);
}; 

export const useAppColorScheme = (): 'light' | 'dark' => {
  const { data: theme } = useAppTheme();
  const systemTheme = useColorScheme();

  if (!theme || theme === Theme.Auto) {
    return systemTheme === 'light' || systemTheme === 'dark' ? systemTheme : 'dark';
  }
  
  return theme as 'light' | 'dark';
};

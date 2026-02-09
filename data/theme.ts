import { queryClient } from '@/data/query-client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery } from '@tanstack/react-query';
import { useColorScheme } from 'react-native';

export enum Theme {
  Auto = 'auto',
  Light = 'light',
  Dark = 'dark'
}


const THEME_KEY = ['theme'];
export const STORAGE_KEY = 'app_theme';

export const useAppTheme = () => {
  const query = useQuery({
    queryKey: THEME_KEY,
    queryFn: async (): Promise<Theme> => {
      const savedTheme = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedTheme && [Theme.Light, Theme.Dark, Theme.Auto].includes(savedTheme as Theme)) {
        return savedTheme as Theme;
      }
      return Theme.Auto;
    },
    initialData: Theme.Auto,
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
  queryClient.setQueryData(THEME_KEY, theme);
  AsyncStorage.setItem(STORAGE_KEY, theme);
}; 

export const useAppColorScheme = (): 'light' | 'dark' => {
  const { data: theme } = useAppTheme();
  const systemTheme = useColorScheme();

  if (!theme || theme === Theme.Auto) {
    return systemTheme ?? 'dark';
  }
  
  return theme as 'light' | 'dark';
};

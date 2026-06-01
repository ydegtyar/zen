import { useAppColorScheme } from '@/data/theme';
import config from '@/tamagui.config';
import { StatusBar } from 'expo-status-bar';
import { ReactNode } from 'react';
import { TamaguiProvider, Theme } from 'tamagui';

interface Props {
  children: ReactNode;
}

export function ZenThemeProvider({ children }: Props) {
  const theme = useAppColorScheme();

  return (
    <TamaguiProvider config={config} defaultTheme={theme}>
      <Theme name={theme}>{children}</Theme>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </TamaguiProvider>
  );
}

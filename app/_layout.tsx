import { queryClient } from '@/data/query-client';
import { ZenThemeProvider } from '@/components/ZenThemeProvider';
import {
  WorkSans_400Regular,
  WorkSans_500Medium,
  WorkSans_600SemiBold,
  WorkSans_700Bold,
} from '@expo-google-fonts/work-sans';
import { OpenSans_700Bold } from '@expo-google-fonts/open-sans';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { configureObserve, useAppObserve, withObserveRoot } from '@/utils/observe';

configureObserve({
  integrations: { 'expo-router': true },
});

SplashScreen.preventAutoHideAsync();

function RootLayout() {
  const [loaded] = useFonts({
    WorkSans_400Regular,
    WorkSans_500Medium,
    WorkSans_600SemiBold,
    WorkSans_700Bold,
    OpenSans_700Bold,
  });
  const { markInteractive } = useAppObserve();

  useEffect(() => {
    if (loaded) {
      void SplashScreen.hideAsync().finally(() => {
        markInteractive();
      });
    }
  }, [loaded, markInteractive]);

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <ZenThemeProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(main)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </ZenThemeProvider>
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}

export default withObserveRoot(RootLayout);

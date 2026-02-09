import { Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'tamagui';

export default function MainLayout() {
  const theme = useTheme();
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background?.val }} >
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen 
          name="index" 
          options={{ 
            title: 'Main',
            gestureEnabled: true,
            gestureDirection: 'horizontal'
          }}
        />
        <Stack.Screen 
          name="stories/[id]" 
          options={{ 
            title: 'Story',
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            title: 'Settings',
          }}
        />
      </Stack>
    </SafeAreaView>
  );
} 
import { Stack } from 'expo-router';
import { Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'tamagui';

const WEB_LAYOUT_TOP_PADDING = 32;

export default function MainLayout() {
  const theme = useTheme();
  
  return (
    <SafeAreaView
      style={[
        { flex: 1, backgroundColor: theme.background?.val },
        Platform.OS === 'web' ? { paddingTop: WEB_LAYOUT_TOP_PADDING } : null,
      ]}
    >
      <Stack screenOptions={{ headerShown: false, freezeOnBlur: true }}>
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

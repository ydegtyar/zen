import { Stack } from 'expo-router';
import { Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'tamagui';

export default function MainLayout() {
  const theme = useTheme();
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background?.val }]} >
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...Platform.select({
      web: {
        padding: 16,
        paddingTop: 32,
      },
    }),
  },
});

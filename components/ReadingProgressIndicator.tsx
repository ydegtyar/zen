import { useProgressPercent } from '@/data/reading-progress';
import { View, YStack } from 'tamagui';
  
export function ReadingProgressIndicator() {
  const percent = useProgressPercent();
  return (
    <YStack backgroundColor="$background" borderTopLeftRadius={12} borderTopRightRadius={12} paddingHorizontal="$3" paddingVertical="$2">
      <View
        backgroundColor="$gray3"
      style={{
        width: '100%',
        height: 7,
        borderRadius: 5,
        overflow: 'hidden',
      }}>
        <View
          backgroundColor="$green8"
          style={{
          width: `${percent}%`,
          height: '100%',
          borderRadius: 5,
        }} />
      </View>
    </YStack>
  );
} 
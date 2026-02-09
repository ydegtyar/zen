import { useProgressPercent } from '@/data/reading-progress';
import { View, YStack } from 'tamagui';

export function ReadingProgressIndicator() {
  const percent = useProgressPercent();
  return (
    <YStack
      backgroundColor="$background"
      borderTopLeftRadius={12}
      borderTopRightRadius={12}
      paddingHorizontal="$3"
      paddingVertical="$2"
    >
      <View
        backgroundColor="$gray2"
        borderColor="$gray5"
        borderWidth={1}
        style={{
          width: '100%',
          height: 8,
          borderRadius: 999,
          overflow: 'hidden',
        }}
      >
        <View
          backgroundColor="$green8"
          shadowColor="$green8"
          shadowOpacity={0.35}
          shadowRadius={6}
          style={{
            width: `${percent}%`,
            height: '100%',
            borderRadius: 999,
          }}
        />
      </View>
    </YStack>
  );
} 

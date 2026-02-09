import Svg, { Circle } from 'react-native-svg';
import { H5, Text, YStack } from 'tamagui';

export function EmptyFavorites() {
  return (
    <YStack flex={1} alignItems="center" padding="$4" gap="$4" marginBlockStart="$10">
      <Svg width="128" height="128" viewBox="0 0 128 128" fill="none">
        <Circle cx="64" cy="64" r="40" stroke="#A8B0A2" strokeWidth="2" />
        <Circle cx="64" cy="64" r="30" stroke="#A8B0A2" strokeWidth="2" />
        <Circle cx="64" cy="64" r="20" stroke="#A8B0A2" strokeWidth="2" />
        <Circle cx="64" cy="64" r="10" fill="#A8B0A2" />
      </Svg>
      <H5 textAlign="center">
        Your favorites are still and quiet.
      </H5>
      <Text fontSize="$4" color="$color" textAlign="center" padding="$2" lineHeight="$5">
      Like a calm pond, waiting for reflections.
      {'\n'}
      Add what brings you peace.
      </Text>
    </YStack>
  );
} 
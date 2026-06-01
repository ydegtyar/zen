import { APP_BUTTON_PALETTE } from '@/components/ui/buttonStyles';
import { useAppColorScheme } from '@/data/theme';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { useEffect } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

interface FavoriteIconProps {
  filled?: boolean;
  size?: number;
  color?: string;
}

export function FavoriteIcon({ filled = false, size = 24, color }: FavoriteIconProps) {
  const colorScheme = useAppColorScheme();
  const iconColor = color || APP_BUTTON_PALETTE[colorScheme].foreground;
  const scale = useSharedValue(1);
  const opacity = useSharedValue(filled ? 1 : 0.7);

  useEffect(() => {
    scale.value = withSpring(1.2, { damping: 6, stiffness: 120 });
    opacity.value = withTiming(filled ? 1 : 0.7, { duration: 200 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 6, stiffness: 120 });
    }, 150);
  }, [filled, opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Ionicons name={filled ? 'heart' : 'heart-outline'} size={size} color={iconColor} />
    </Animated.View>
  );
}

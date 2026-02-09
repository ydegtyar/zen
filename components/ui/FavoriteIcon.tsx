import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

interface FavoriteIconProps {
  filled?: boolean;
  size?: number;
  color?: string;
}

export function FavoriteIcon({ filled = false, size = 24, color }: FavoriteIconProps) {
  const scheme = useColorScheme() ?? 'light';
  const iconColor = color || Colors[scheme].tint;
  const scale = useSharedValue(1);
  const opacity = useSharedValue(filled ? 1 : 0.7);

  useEffect(() => {
    scale.value = withSpring(1.2, { damping: 6, stiffness: 120 });
    opacity.value = withTiming(filled ? 1 : 0.7, { duration: 200 });
    setTimeout(() => {
      scale.value = withSpring(1, { damping: 6, stiffness: 120 });
    }, 150);
  }, [filled]);

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
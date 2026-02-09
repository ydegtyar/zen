import Svg, { Circle } from 'react-native-svg';
import { H5, Text, YStack } from 'tamagui';
import { i18n } from '@/data/i18n';
import { Pressable } from 'react-native';
import { useCallback, useEffect, useRef, useState } from 'react';
import Animated, { Easing, useAnimatedProps, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { useStories } from '@/data/queries/stories';
import { useRouter } from 'expo-router';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export function EmptyFavorites() {
  const router = useRouter();
  const { data: stories = [] } = useStories();
  const [isAnimating, setIsAnimating] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const ripple1 = useSharedValue(0);
  const ripple2 = useSharedValue(0);
  const ripple3 = useSharedValue(0);

  const ripple1Props = useAnimatedProps(() => ({
    r: 40 + ripple1.value * 22,
    strokeOpacity: 1 - ripple1.value,
  }));
  const ripple2Props = useAnimatedProps(() => ({
    r: 30 + ripple2.value * 26,
    strokeOpacity: 1 - ripple2.value,
  }));
  const ripple3Props = useAnimatedProps(() => ({
    r: 20 + ripple3.value * 30,
    strokeOpacity: 1 - ripple3.value,
  }));

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const startRipples = useCallback(() => {
    ripple1.value = 0;
    ripple2.value = 0;
    ripple3.value = 0;
    ripple1.value = withTiming(1, { duration: 900, easing: Easing.out(Easing.quad) });
    ripple2.value = withDelay(120, withTiming(1, { duration: 900, easing: Easing.out(Easing.quad) }));
    ripple3.value = withDelay(240, withTiming(1, { duration: 900, easing: Easing.out(Easing.quad) }));
  }, [ripple1, ripple2, ripple3]);

  const handlePress = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    startRipples();
    timeoutRef.current = setTimeout(() => {
      if (!stories.length) {
        setIsAnimating(false);
        return;
      }
      const story = stories[Math.floor(Math.random() * stories.length)];
      router.push({
        pathname: '/stories/[id]',
        params: { id: story?.index ?? 1 }
      });
    }, 350);
  }, [isAnimating, router, startRipples, stories]);

  return (
    <YStack flex={1} alignItems="center" padding="$4" gap="$4" marginBlockStart="$10">
      <Pressable onPress={handlePress} accessibilityRole="button">
        <Svg width="128" height="128" viewBox="0 0 128 128" fill="none">
          <AnimatedCircle animatedProps={ripple1Props} cx="64" cy="64" stroke="#A8B0A2" strokeWidth="2" />
          <AnimatedCircle animatedProps={ripple2Props} cx="64" cy="64" stroke="#A8B0A2" strokeWidth="2" />
          <AnimatedCircle animatedProps={ripple3Props} cx="64" cy="64" stroke="#A8B0A2" strokeWidth="2" />
          <Circle cx="64" cy="64" r="10" fill="#A8B0A2" />
        </Svg>
      </Pressable>
      <H5 textAlign="center">
        {i18n.t('favorites.empty.title')}
      </H5>
      <Text fontSize="$4" color="$color" textAlign="center" padding="$2" lineHeight="$5">
        {i18n.t('favorites.empty.body')}
      </Text>
    </YStack>
  );
}

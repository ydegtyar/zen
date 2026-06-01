import { Story } from "@/data/Story";
import { i18n } from '@/data/i18n';
import { useLastReadStore } from '@/data/last-read';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { memo, useCallback, useMemo } from 'react';
import { TouchableHighlight, useWindowDimensions, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';
import { Text, XStack, YStack, useTheme } from 'tamagui';
import { lightHaptic } from '@/utils/haptics';
import { useLocaleHeadingFontFamily } from '@/utils/locale-fonts';

interface Props {
  story: Story;
}

const DISMISS_VELOCITY = 850;
const PLACEHOLDER_IMAGE = require('@/assets/images/placeholder.png');

function ContinueReadingComponent({ story }: Props) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const clearLastRead = useLastReadStore(state => state.clearLastRead);
  const headingFontFamily = useLocaleHeadingFontFamily();
  const translateX = useSharedValue(0);
  const backgroundColor = theme.background?.val ?? 'transparent';
  const dismissBackgroundColor = theme.gray3?.val ?? backgroundColor;
  const dismissThreshold = Math.max(96, Math.min(width * 0.34, 160));
  const offscreenDistance = width + 120;

  const handleDismiss = useCallback(() => {
    void lightHaptic();
    clearLastRead(story.index);
  }, [clearLastRead, story.index]);

  const href = useMemo(
    () => ({ pathname: '/stories/[id]' as const, params: { id: String(story.index) } }),
    [story.index]
  );

  const panGesture = Gesture.Pan()
    .activeOffsetX([-12, 12])
    .failOffsetY([-16, 16])
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      const shouldDismiss =
        Math.abs(event.translationX) > dismissThreshold ||
        (Math.abs(event.velocityX) > DISMISS_VELOCITY && Math.abs(event.translationX) > 40);

      if (shouldDismiss) {
        const direction = event.translationX >= 0 ? 1 : -1;
        translateX.value = withTiming(direction * offscreenDistance, { duration: 220 }, (finished) => {
          if (finished) {
            runOnJS(handleDismiss)();
          }
        });
        return;
      }

      translateX.value = withSpring(0, { damping: 18, stiffness: 180 });
    });

  const animatedCardStyle = useAnimatedStyle(() => {
    const progress = Math.min(Math.abs(translateX.value) / dismissThreshold, 1);

    return {
      opacity: 1 - progress * 0.35,
      transform: [
        { translateX: translateX.value },
        { rotateZ: `${translateX.value * 0.02}deg` },
      ],
    };
  });

  return (
    <YStack marginVertical={8} width="100%">
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          borderRadius: 16,
          backgroundColor: dismissBackgroundColor,
        }}
      />
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[{ width: '100%' }, animatedCardStyle]}>
          <Link href={href} asChild>
            <TouchableHighlight
              underlayColor={backgroundColor}
              onPressIn={() => {
                void lightHaptic();
              }}
              style={{ borderRadius: 16, width: '100%', backgroundColor }}
            >
              <XStack paddingHorizontal="$1" paddingVertical="$2" alignItems="flex-start" gap="$3" >
                <YStack flex={1}>
                  <Text fontSize="$3" color="$gray9" marginBottom={2}>{i18n.t('app.continueReading')}</Text>
                  <Text fontFamily={headingFontFamily} fontWeight="bold" fontSize="$4" marginTop={'$1'} numberOfLines={2}>{story.title}</Text>
                  <Text fontSize="$3" color="$color" numberOfLines={2} marginTop={2}>{story.text}</Text>
                </YStack>
                <Image
                  source={story.image || PLACEHOLDER_IMAGE}
                  style={{ width: 96, height: 96, borderRadius: 16 }}
                  contentFit="cover"
                  recyclingKey={String(story.index)}
                />
              </XStack>
            </TouchableHighlight>
          </Link>
        </Animated.View>
      </GestureDetector>
    </YStack>
  );
}

export const ContinueReading = memo(ContinueReadingComponent);

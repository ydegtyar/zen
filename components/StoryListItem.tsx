import { Story } from "@/data/Story";
import { useIsRead } from '@/data/reading-progress';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import React, { useEffect } from 'react';
import { TouchableHighlight } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Text, XStack, YStack, useTheme } from 'tamagui';

interface Props {
  story: Story;
}

export function StoryListItem({ story }: Props) {
  const opacity = useSharedValue(0);
  const isRead = useIsRead(story.index);
  const theme = useTheme();

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(opacity.value, { duration: 400 }),
    transform: [{ translateY: withTiming(opacity.value ? 0 : 20, { duration: 400 }) }],
  }));

  useEffect(() => {
    opacity.value = 1;
  }, [story.index, opacity]);

  
  return (
    <Animated.View
      style={animatedStyle}
      key={story.index}
    >
      <Link
        href={{ pathname: '/stories/[id]', params: { id: String(story.index) } }}
        asChild
      >
        <TouchableHighlight
          underlayColor={theme.background.val}
          style={{ 
            borderRadius: 16, 
            marginHorizontal: 0, 
            marginVertical: 2, 
            backgroundColor: isRead ? theme.gray3.val : theme.background.val 
          }}
        >
          <XStack paddingHorizontal="$3" paddingVertical="$2" alignItems="center" gap="$3">
            <Image
              source={require('@/assets/images/placeholder.png')}
              style={{ width: 48, height: 48, borderRadius: 12 }}
              contentFit="cover"
            />
            <YStack flex={1}>
              <Text fontWeight="bold" fontSize="$4" numberOfLines={1}>{story.title}</Text>
              <Text fontSize="$3" color="$color" numberOfLines={1}>{story.text}</Text>
            </YStack>
          </XStack>
        </TouchableHighlight>
      </Link>
    </Animated.View>
  );
} 
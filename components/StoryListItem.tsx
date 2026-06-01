import { Story } from "@/data/Story";
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import React, { memo, useMemo } from 'react';
import { TouchableHighlight } from 'react-native';
import { Text, XStack, YStack, useTheme } from 'tamagui';
import { lightHaptic } from '@/utils/haptics';

interface Props {
  story: Story;
  isRead: boolean;
}

const PLACEHOLDER_IMAGE = require('@/assets/images/placeholder.png');

function StoryListItemComponent({ story, isRead }: Props) {
  const theme = useTheme();
  const backgroundColor = theme.background?.val ?? 'transparent';
  const readBackgroundColor = theme.gray3?.val ?? backgroundColor;
  const href = useMemo(
    () => ({ pathname: '/stories/[id]' as const, params: { id: String(story.index) } }),
    [story.index]
  );

  return (
    <Link href={href} asChild>
      <TouchableHighlight
        underlayColor={backgroundColor}
        onPressIn={() => {
          void lightHaptic();
        }}
        style={{
          borderRadius: 16,
          marginHorizontal: 0,
          marginVertical: 2,
          backgroundColor: isRead ? readBackgroundColor : backgroundColor
        }}
      >
        <XStack paddingHorizontal="$1" paddingVertical="$2" alignItems="center" gap="$3">
          <Image
            source={story.image || PLACEHOLDER_IMAGE}
            style={{ width: 48, height: 48, borderRadius: 12 }}
            contentFit="cover"
            recyclingKey={String(story.index)}
          />
          <YStack flex={1}>
            <Text fontWeight="bold" fontSize="$4" numberOfLines={1}>{story.title}</Text>
            <Text fontSize="$3" color="$color" numberOfLines={1}>{story.text}</Text>
          </YStack>
        </XStack>
      </TouchableHighlight>
    </Link>
  );
}

export const StoryListItem = memo(StoryListItemComponent);

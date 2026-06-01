import { Story } from "@/data/Story";
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import React, { memo, useMemo } from 'react';
import { Platform, TouchableHighlight } from 'react-native';
import { Text, XStack, YStack, useTheme } from 'tamagui';
import { lightHaptic } from '@/utils/haptics';
import { useLocaleHeadingFontFamily } from '@/utils/locale-fonts';

interface Props {
  story: Story;
  isRead: boolean;
}

const PLACEHOLDER_IMAGE = require('@/assets/images/placeholder.png');
const BODY_FONT_FAMILY = Platform.select({
  web: 'WorkSans_400Regular, sans-serif',
  default: 'WorkSans_400Regular',
});

function StoryListItemComponent({ story, isRead }: Props) {
  const theme = useTheme();
  const backgroundColor = theme.background?.val ?? 'transparent';
  const readBackgroundColor = theme.gray3?.val ?? backgroundColor;
  const titleFontFamily = useLocaleHeadingFontFamily();
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
            <Text fontFamily={titleFontFamily} fontWeight="bold" fontSize="$4" numberOfLines={1}>
              {story.title}
            </Text>
            <Text fontFamily={BODY_FONT_FAMILY} fontSize="$3" color="$color" numberOfLines={1}>
              {story.text}
            </Text>
          </YStack>
        </XStack>
      </TouchableHighlight>
    </Link>
  );
}

export const StoryListItem = memo(StoryListItemComponent);

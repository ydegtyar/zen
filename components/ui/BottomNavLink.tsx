import { Ionicons } from '@expo/vector-icons';
import { Href, Link } from 'expo-router';
import { Button, Text, useTheme, XStack } from 'tamagui';

type Props = {
  href: Href;
  title: string;
  direction: 'prev' | 'next';
};

export function BottomNavLink({ href, title, direction }: Props) {
  const { color } = useTheme();
  const isPrev = direction === 'prev';

  return (
    <Link href={href} asChild>
      <Button
        unstyled
        flex={1}
        borderRadius={14}
        borderWidth={1}
        paddingVertical="$3"
        paddingHorizontal="$3"
        backgroundColor="$gray4"
        borderColor="$gray2"
        justifyContent={isPrev ? 'flex-start' : 'flex-end'}
        alignItems="center"
        pressStyle={{ backgroundColor: '$gray2', opacity: 0.9, scale: 0.98 }}
        aria-label={isPrev ? 'Previous story' : 'Next story'}
      >
        <XStack
          alignItems="center"
          gap="$2"
          flex={1}
          justifyContent={isPrev ? 'flex-start' : 'flex-end'}
        >
          {isPrev && <Ionicons name="chevron-back" size={20} color={color.val} />}
          <Text
            color="$color"
            numberOfLines={2}
            flex={1}
            textAlign={isPrev ? 'left' : 'right'}
            fontWeight="600"
          >
            {title}
          </Text>
          {!isPrev && <Ionicons name="chevron-forward" size={20} color={color.val} />}
        </XStack>
      </Button>
    </Link>
  );
}

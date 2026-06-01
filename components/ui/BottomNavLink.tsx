import { Ionicons } from '@react-native-vector-icons/ionicons';
import { Href, Link } from 'expo-router';
import { Button, Text, XStack } from 'tamagui';
import { lightHaptic } from '@/utils/haptics';
import { getAppButtonStyle, useAppButtonPalette } from '@/components/ui/buttonStyles';

type Props = {
  href: Href;
  title: string;
  direction: 'prev' | 'next';
  replace?: boolean;
};

export function BottomNavLink({ href, title, direction, replace = false }: Props) {
  const buttonPalette = useAppButtonPalette();
  const isPrev = direction === 'prev';

  return (
    <Link href={href} asChild replace={replace}>
      <Button
        unstyled
        flex={1}
        borderRadius={14}
        borderWidth={1}
        paddingVertical="$3"
        paddingHorizontal="$3"
        {...getAppButtonStyle(buttonPalette)}
        justifyContent={isPrev ? 'flex-start' : 'flex-end'}
        alignItems="center"
        onPressIn={() => {
          void lightHaptic();
        }}
        aria-label={isPrev ? 'Previous story' : 'Next story'}
      >
        <XStack
          alignItems="center"
          gap="$2"
          flex={1}
          justifyContent={isPrev ? 'flex-start' : 'flex-end'}
        >
          {isPrev && <Ionicons name="chevron-back" size={20} color={buttonPalette.foreground} />}
          <Text
            color={buttonPalette.foreground}
            numberOfLines={2}
            flex={1}
            textAlign={isPrev ? 'left' : 'right'}
            fontWeight="600"
          >
            {title}
          </Text>
          {!isPrev && <Ionicons name="chevron-forward" size={20} color={buttonPalette.foreground} />}
        </XStack>
      </Button>
    </Link>
  );
}

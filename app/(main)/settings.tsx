import { Header } from '@/components/Header';
import { i18n, } from '@/data/i18n';
import { Language, setLanguage, useLanguage } from '@/data/language';
import { setTheme, Theme, useAppTheme } from '@/data/theme';
import { ArrowLeft, Contrast, Moon, Sun } from '@tamagui/lucide-icons';
import { Link } from 'expo-router';
import { Button, H4, H5, Text, XStack, YStack } from 'tamagui';

const LANGUAGES = [
  { code: Language.En, label: 'English' },
  { code: Language.Uk, label: 'Українська' },
  { code: Language.Ru, label: 'Русский' },
];

const THEMES: { value: Theme, title: Theme, label: string, icon: typeof Contrast }[] = [
  { value: Theme.Auto, title: Theme.Auto, label: 'Auto', icon: Contrast },
  { value: Theme.Light, title: Theme.Light, label: 'Light', icon: Sun },
  { value: Theme.Dark, title: Theme.Dark, label: 'Dark', icon: Moon },
];

export default function SettingsScreen() {
  const { data: language } = useLanguage();
  const { data: theme } = useAppTheme();
  
  return (
    <YStack flex={1} backgroundColor="$background">
      <Header
        startSlot={
          <Link href={{ pathname: '/' }} asChild>
            <Button size="$3" chromeless aria-label="Back">
              <ArrowLeft />
            </Button>
          </Link>
        }
        middleSlot={<H4>{i18n.t('settings.title')}</H4>}
        endSlot={null}
      />
      <YStack padding="$4" gap="$4" flex={1}>
        <H5>{i18n.t('settings.language')}</H5>
        <YStack gap="$2">
          {LANGUAGES.map(lang => (
            <Button
              key={lang.code}
              size="$4"
              borderWidth={1}
              themeInverse={language === lang.code}
              onPress={() => setLanguage(lang.code as Language)}
            >
              {lang.label}
            </Button>
          ))}
        </YStack>

        <H5 marginTop="$4">{i18n.t('settings.theme.title')}</H5>
        <XStack gap="$2" flexWrap="wrap" flex={1} width="100%">
          {THEMES.map(item => (
            <Button
              key={item.title}
              size="$4"
              themeInverse={theme === item.value}
              borderWidth={1}
              onPress={() => setTheme(item.value)}
              flex={1}
            >
              <YStack flexDirection="row" alignItems="center" gap="$2">
                <item.icon size={20} />
                <Text>{i18n.t(`settings.theme.${item.title.toLowerCase()}`)}</Text>
              </YStack>
            </Button>
          ))}
        </XStack>
      </YStack>
    </YStack>
  );
}

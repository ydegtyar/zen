import type React from 'react';
import { Header } from '@/components/Header';
import { i18n } from '@/data/i18n';
import { Language, setLanguage, useLanguage } from '@/data/language';
import { setTheme, Theme, useAppTheme } from '@/data/theme';
import { ArrowLeft, Contrast, Moon, Sun } from '@tamagui/lucide-icons';
import { Link } from 'expo-router';
import { Adapt, Button, Dialog, H4, H5, ScrollView, Separator, Sheet, Text, XStack, YStack } from 'tamagui';
import { lightHaptic } from '@/utils/haptics';
import { getAppLinks } from '@/constants/appLinks';
import { openExternalUrl } from '@/utils/openExternalUrl';

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

type PolicySection = {
  heading: string;
  body: string | string[];
};

const POLICY_LAST_UPDATED = new Date().toISOString().slice(0, 10);

const PRIVACY_SECTIONS: PolicySection[] = [
  {
    heading: 'Summary',
    body: 'Zen is a reader app. It stores preferences like language, theme, and reading progress on your device. The app does not set cookies.',
  },
  {
    heading: 'Data we collect',
    body: 'On-device only: app preferences such as language/theme and reading progress.',
  },
  {
    heading: 'Third-party services',
    body: 'If we add analytics, crash reporting, accounts, payments, or notifications, we will update this policy and the app store disclosures.',
  },
  {
    heading: 'Contact',
    body: 'For privacy questions, use the Support link.',
  },
];

const TERMS_SECTIONS: PolicySection[] = [
  {
    heading: 'Use of the app',
    body: 'The app is provided "as is". You are responsible for how you use the content.',
  },
  {
    heading: 'Changes',
    body: 'We may update these terms occasionally. The "Last updated" date will reflect changes.',
  },
  {
    heading: 'Contact',
    body: 'If you need help, use the Support link.',
  },
];

function LinkButton({ children, ...props }: React.ComponentProps<typeof Button>) {
  return (
    <Button
      {...props}
      unstyled
      padding={0}
      alignSelf="flex-start"
      minHeight="auto"
      hoverStyle={{ opacity: 0.8 }}
      pressStyle={{ opacity: 0.6 }}
    >
      <Text fontWeight="600" textDecorationLine="underline">
        {children}
      </Text>
    </Button>
  );
}

function PolicyContent({ title, lastUpdated, sections }: { title: string; lastUpdated: string; sections: PolicySection[] }) {
  return (
    <YStack gap="$3">
      <Dialog.Title>{title}</Dialog.Title>
      <Text opacity={0.7}>
        {i18n.t('common.lastUpdated')}: {lastUpdated}
      </Text>
      <YStack gap="$3">
        {sections.map(section => (
          <YStack key={section.heading} gap="$1">
            <H5>{section.heading}</H5>
            {Array.isArray(section.body) ? (
              section.body.map((line, index) => (
                <Text key={line + index} lineHeight={20}>
                  - {line}
                </Text>
              ))
            ) : (
              <Text lineHeight={20}>{section.body}</Text>
            )}
          </YStack>
        ))}
      </YStack>
    </YStack>
  );
}

function PolicyDialog({
  triggerLabel,
  title,
  sections,
  lastUpdated,
}: {
  triggerLabel: string;
  title: string;
  sections: PolicySection[];
  lastUpdated: string;
}) {
  return (
    <Dialog modal>
      <Dialog.Trigger asChild>
        <LinkButton onPressIn={() => void lightHaptic()}>{triggerLabel}</LinkButton>
      </Dialog.Trigger>

      <Adapt when="sm" platform="touch">
        <Sheet modal dismissOnSnapToBottom snapPoints={[85]} animation="quick">
          <Sheet.Overlay />
          <Sheet.Frame padding="$4" gap="$3" backgroundColor="$background">
            <Sheet.Handle />
            <Sheet.ScrollView showsVerticalScrollIndicator>
              <PolicyContent title={title} lastUpdated={lastUpdated} sections={sections} />
            </Sheet.ScrollView>
            <Dialog.Close asChild>
              <Button size="$3" borderWidth={1} onPressIn={() => void lightHaptic()}>
                {i18n.t('common.close')}
              </Button>
            </Dialog.Close>
          </Sheet.Frame>
        </Sheet>
      </Adapt>

      <Dialog.Portal>
        <Dialog.Overlay key="overlay" backgroundColor="rgba(0,0,0,0.2)" />
        <Dialog.Content key="content" bordered elevate size="$4" maxWidth={640} width="90%">
          <YStack gap="$3" maxHeight={460}>
            <ScrollView showsVerticalScrollIndicator>
              <PolicyContent title={title} lastUpdated={lastUpdated} sections={sections} />
            </ScrollView>
            <XStack justifyContent="flex-end">
              <Dialog.Close asChild>
                <Button size="$3" borderWidth={1} onPressIn={() => void lightHaptic()}>
                  {i18n.t('common.close')}
                </Button>
              </Dialog.Close>
            </XStack>
          </YStack>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
}

export default function SettingsScreen() {
  const { data: language } = useLanguage();
  const { data: theme } = useAppTheme();
  const links = getAppLinks();
  
  return (
    <YStack flex={1} backgroundColor="$background">
      <Header
        startSlot={
          <Link href={{ pathname: '/' }} asChild>
            <Button
              size="$3"
              chromeless
              aria-label="Back"
              onPressIn={() => {
                void lightHaptic();
              }}
            >
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
              onPressIn={() => {
                void lightHaptic();
              }}
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
              onPressIn={() => {
                void lightHaptic();
              }}
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

        <Separator marginTop="$2" />
        <YStack gap="$2" marginTop="$2">
          {links.privacyPolicyUrl.length > 0 ? (
            <PolicyDialog
              triggerLabel={i18n.t('settings.about.privacy')}
              title={i18n.t('settings.about.privacy')}
              sections={PRIVACY_SECTIONS}
              lastUpdated={POLICY_LAST_UPDATED}
            />
          ) : null}
          {links.termsOfServiceUrl.length > 0 ? (
            <PolicyDialog
              triggerLabel={i18n.t('settings.about.terms')}
              title={i18n.t('settings.about.terms')}
              sections={TERMS_SECTIONS}
              lastUpdated={POLICY_LAST_UPDATED}
            />
          ) : null}
          {links.supportUrl.length > 0 ? (
            <LinkButton
              onPressIn={() => void lightHaptic()}
              onPress={() => void openExternalUrl(links.supportUrl)}
            >
              {i18n.t('settings.about.support')}
            </LinkButton>
          ) : null}

          {links.privacyPolicyUrl.length === 0 &&
          links.termsOfServiceUrl.length === 0 &&
          links.supportUrl.length === 0 ? (
            <Text opacity={0.7}>{i18n.t('settings.about.missingLinks')}</Text>
          ) : null}
        </YStack>
      </YStack>
    </YStack>
  );
}

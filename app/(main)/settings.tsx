import type React from 'react';
import { Header } from '@/components/Header';
import { getAppButtonStyle, useAppButtonPalette } from '@/components/ui/buttonStyles';
import { i18n } from '@/data/i18n';
import { Language, setLanguage, useLanguage } from '@/data/language';
import { resetReadingProgress } from '@/data/reading-progress';
import { setTheme, Theme, useAppTheme } from '@/data/theme';
import { ArrowLeft, Contrast, Moon, RefreshCcw, Sun } from '@tamagui/lucide-icons-2';
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
        <Sheet modal dismissOnSnapToBottom snapPoints={[85]}>
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
  const buttonPalette = useAppButtonPalette();
  
  return (
    <YStack flex={1} backgroundColor="$background">
      <Header
        startSlot={
          <Link href={{ pathname: '/' }} asChild>
            <Button
              size="$3"
              circular
              borderWidth={1}
              {...getAppButtonStyle(buttonPalette)}
              aria-label="Back"
              onPressIn={() => {
                void lightHaptic();
              }}
            >
              <ArrowLeft size={20} color={buttonPalette.foreground} />
            </Button>
          </Link>
        }
        middleSlot={<H4>{i18n.t('settings.title')}</H4>}
        endSlot={null}
      />
      <YStack padding="$4" gap="$4" flex={1}>
        <H5>{i18n.t('settings.language')}</H5>
        <YStack gap="$2">
          {LANGUAGES.map(lang => {
            const isSelected = language === lang.code;

            return (
              <Button
                key={lang.code}
                size="$4"
                borderWidth={1}
                {...getAppButtonStyle(buttonPalette, isSelected)}
                onPressIn={() => {
                  void lightHaptic();
                }}
                onPress={() => setLanguage(lang.code as Language)}
              >
                <Text color={buttonPalette.foreground} fontWeight={isSelected ? '600' : '400'}>
                  {lang.label}
                </Text>
              </Button>
            );
          })}
        </YStack>

        <H5 marginTop="$4">{i18n.t('settings.theme.title')}</H5>
        <XStack gap="$2" flexWrap="wrap" width="100%">
          {THEMES.map(item => {
            const isSelected = theme === item.value;
            const contentColor = buttonPalette.foreground;

            return (
              <Button
                key={item.title}
                size="$4"
                borderWidth={1}
                {...getAppButtonStyle(buttonPalette, isSelected)}
                onPressIn={() => {
                  void lightHaptic();
                }}
                onPress={() => setTheme(item.value)}
                flex={1}
              >
                <YStack flexDirection="row" alignItems="center" gap="$2">
                  <item.icon size={20} color={contentColor} />
                  <Text color={contentColor}>
                    {i18n.t(`settings.theme.${item.title.toLowerCase()}`)}
                  </Text>
                </YStack>
              </Button>
            );
          })}
        </XStack>

        {__DEV__ ? (
          <>
            <Separator marginTop="$2" />
            <Button
              size="$4"
              borderWidth={1}
              {...getAppButtonStyle(buttonPalette)}
              onPressIn={() => {
                void lightHaptic();
              }}
              onPress={() => {
                void resetReadingProgress();
              }}
            >
              <XStack alignItems="center" gap="$2">
                <RefreshCcw size={20} color={buttonPalette.foreground} />
                <Text color={buttonPalette.foreground}>{i18n.t('settings.resetAlreadyRead')}</Text>
              </XStack>
            </Button>
          </>
        ) : null}

        <YStack gap="$2" marginTop="auto">
          <Separator />
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
    </YStack>
  );
}

import { shorthands } from '@tamagui/shorthands'
import { tokens as baseTokens } from '@tamagui/themes'
import { createTamagui } from 'tamagui'
import { themes } from './themes'

const config = createTamagui({
  defaultTheme: 'light',
  shouldAddPrefersColorThemes: false,
  themeClassNameOnRoot: false,
  shorthands,
  fonts: {
    heading: {
      family: 'WorkSans_700Bold',
      size: {
        1: 12,
        2: 14,
        3: 16,
        4: 18,
        5: 20,
        6: 24,
        7: 28,
        8: 32,
        9: 36,
        10: 48,
      },
      lineHeight: {
        1: 16,
        2: 18,
        3: 20,
        4: 22,
        5: 24,
        6: 28,
        7: 32,
        8: 36,
        9: 40,
        10: 52,
      },
      weight: {
        4: '400',
        6: '600',
        7: '700',
      },
      letterSpacing: {
        4: 0,
        6: -1,
        7: -2,
      },
    },
    body: {
      family: 'WorkSans_400Regular',
      size: {
        1: 12,
        2: 14,
        3: 16,
        4: 18,
        5: 20,
        6: 24,
        7: 28,
        8: 32,
        9: 36,
        10: 48,
      },
      lineHeight: {
        1: 16,
        2: 18,
        3: 20,
        4: 22,
        5: 24,
        6: 28,
        7: 32,
        8: 36,
        9: 40,
        10: 52,
      },
      weight: {
        4: '400',
        6: '600',
        7: '700',
      },
      letterSpacing: {
        4: 0,
        6: -1,
        7: -2,
      },
    },
  },
  themes,
  tokens: {
    ...baseTokens,
    space: {
      ...baseTokens.space,
      1: 4,
    },
  },
  media: ({
    xs: { maxWidth: 660 },
    sm: { maxWidth: 800 },
    md: { maxWidth: 1020 },
    lg: { maxWidth: 1280 },
    xl: { maxWidth: 1420 },
    xxl: { maxWidth: 1600 },
    gtXs: { minWidth: 660 + 1 },
    gtSm: { minWidth: 800 + 1 },
    gtMd: { minWidth: 1020 + 1 },
    gtLg: { minWidth: 1280 + 1 },
    short: { maxHeight: 820 },
    tall: { minHeight: 820 },
    hoverNone: { hover: 'none' },
    pointerCoarse: { pointer: 'coarse' },
  }),
})

export type AppConfig = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config 
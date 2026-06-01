import { useAppColorScheme } from '@/data/theme';

export const APP_BUTTON_PALETTE = {
  light: {
    surface: '$gray2',
    selectedSurface: 'rgba(168, 176, 162, 0.24)',
    border: '$gray4',
    selectedBorder: 'rgba(168, 176, 162, 0.62)',
    pressedSurface: 'rgba(168, 176, 162, 0.16)',
    selectedPressedSurface: 'rgba(168, 176, 162, 0.32)',
    foreground: '#11181C',
    icon: '#5f6f5b',
  },
  dark: {
    surface: '$gray3',
    selectedSurface: 'rgba(168, 176, 162, 0.20)',
    border: '$gray5',
    selectedBorder: 'rgba(168, 176, 162, 0.42)',
    pressedSurface: 'rgba(168, 176, 162, 0.14)',
    selectedPressedSurface: 'rgba(168, 176, 162, 0.28)',
    foreground: '#ECEDEE',
    icon: '#c6d0bf',
  },
} as const;

export type AppButtonPalette = (typeof APP_BUTTON_PALETTE)[keyof typeof APP_BUTTON_PALETTE];

export function useAppButtonPalette() {
  const colorScheme = useAppColorScheme();

  return APP_BUTTON_PALETTE[colorScheme];
}

export function getAppButtonStyle(palette: AppButtonPalette, selected = false) {
  return {
    backgroundColor: selected ? palette.selectedSurface : palette.surface,
    borderColor: selected ? palette.selectedBorder : palette.border,
    color: palette.foreground,
    pressStyle: {
      backgroundColor: selected ? palette.selectedPressedSurface : palette.pressedSurface,
      opacity: 0.92,
      scale: 0.99,
    },
  };
}

/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    // Input and form colors - using gray shades
    inputBackground: '#f8f9fa',
    inputBorder: '#e1e5e9',
    inputText: '#11181C',
    placeholder: '#9ca3af',
    // Card and surface colors - using gray shades
    cardBackground: '#ffffff',
    surfaceBackground: '#f8f9fa',
    // Border and divider colors - using gray shades
    border: '#e1e5e9',
    divider: '#f1f3f4',
    // Button colors - using gray shades
    buttonBackground: '#f1f3f4',
    buttonText: '#11181C',
    buttonBorder: '#d1d5db',
    buttonPressed: '#e5e7eb',
    // Status colors - using gray shades instead of colors
    success: '#6b7280',
    warning: '#9ca3af',
    error: '#6b7280',
    info: '#9ca3af',
    green8: '#22c55e',
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    // Input and form colors - using gray shades
    inputBackground: '#1f2937',
    inputBorder: '#374151',
    inputText: '#f9fafb',
    placeholder: '#6b7280',
    // Card and surface colors - using gray shades
    cardBackground: '#1f2937',
    surfaceBackground: '#111827',
    // Border and divider colors - using gray shades
    border: '#374151',
    divider: '#374151',
    // Button colors - using gray shades
    buttonBackground: '#374151',
    buttonText: '#f9fafb',
    buttonBorder: '#4b5563',
    buttonPressed: '#4b5563',
    // Status colors - using gray shades instead of colors
    success: '#9ca3af',
    warning: '#6b7280',
    error: '#9ca3af',
    info: '#6b7280',
    green8: '#22c55e',
  },
};

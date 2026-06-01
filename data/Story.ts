import type { ImageSource } from 'expo-image';

export type Story = {
  index: number;
  title: string;
  text: string;
  image?: ImageSource | string | number;
};

import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

export async function openExternalUrl(url: string) {
  const trimmed = url.trim();
  if (trimmed.length === 0) return;

  if (trimmed.startsWith('mailto:') || trimmed.startsWith('tel:')) {
    await Linking.openURL(trimmed);
    return;
  }

  await WebBrowser.openBrowserAsync(trimmed);
}


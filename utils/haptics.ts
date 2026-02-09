import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export async function lightHaptic() {
  if (Platform.OS === 'web') {
    return;
  }

  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {
    // Haptics can be unavailable on some devices/emulators.
  }
}

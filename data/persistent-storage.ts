import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

function canUseAsyncStorage() {
  return !(Platform.OS === 'web' && typeof window === 'undefined');
}

export async function getPersistentItem(key: string) {
  if (!canUseAsyncStorage()) {
    return null;
  }

  return AsyncStorage.getItem(key);
}

export async function setPersistentItem(key: string, value: string) {
  if (!canUseAsyncStorage()) {
    return;
  }

  await AsyncStorage.setItem(key, value);
}

export async function removePersistentItem(key: string) {
  if (!canUseAsyncStorage()) {
    return;
  }

  await AsyncStorage.removeItem(key);
}

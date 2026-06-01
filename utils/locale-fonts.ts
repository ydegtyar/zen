import { Language, useLanguage } from '@/data/language';
import { Platform } from 'react-native';

const cyrillicHeadingFontFamily = Platform.select({
  web: 'OpenSans_700Bold, WorkSans_700Bold, Arial, Helvetica, sans-serif',
  default: 'OpenSans_700Bold',
});

const defaultHeadingFontFamily = Platform.select({
  web: 'WorkSans_700Bold, Arial, Helvetica, sans-serif',
  default: 'WorkSans_700Bold',
});

export function isCyrillicLanguage(language?: Language) {
  return language === Language.Uk || language === Language.Ru;
}

export function getLocaleHeadingFontFamily(language?: Language) {
  return isCyrillicLanguage(language) ? cyrillicHeadingFontFamily : defaultHeadingFontFamily;
}

export function useLocaleHeadingFontFamily() {
  const { data: language } = useLanguage();

  return getLocaleHeadingFontFamily(language);
}

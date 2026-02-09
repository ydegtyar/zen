import { I18n } from 'i18n-js';
import en from '../languages/en.json';
import ru from '../languages/ru.json';
import uk from '../languages/uk.json';

export const i18n = new I18n({ en, uk, ru }, {
  defaultLocale: 'en',
  defaultSeparator: '.',
  enableFallback: true,
  locale: 'en',
  missingBehavior: 'guess',
});


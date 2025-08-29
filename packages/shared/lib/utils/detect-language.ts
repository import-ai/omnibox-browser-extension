import type { Language } from '../utils/shared-types.js';

export function detectBrowserLanguage(): Language {
  if (typeof navigator === 'undefined') {
    return 'en';
  }

  const browserLang = navigator.language;
  if (browserLang && browserLang.toLowerCase().startsWith('zh')) {
    return 'zh';
  }
  return 'en';
}

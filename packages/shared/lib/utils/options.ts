import type { Language, Storage, Theme } from '../utils/shared-types.js';
import { detectBrowserLanguage } from './detect-language.js';

export function getOptions(response: {
  apiBaseUrl?: string;
  namespaceId?: string;
  resourceId?: string;
  language?: Language;
  theme?: Theme;
}): Storage {
  return {
    resourceId: response.resourceId || '',
    namespaceId: response.namespaceId || '',
    theme: response.theme || 'light',
    language: response.language || detectBrowserLanguage(),
    apiBaseUrl: response.apiBaseUrl || 'https://www.omnibox.pro',
  };
}

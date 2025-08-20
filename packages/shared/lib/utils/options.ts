import type { Language, Storage, Theme } from '../utils/shared-types.js';

export function getOptions(response: {
  apiKey?: string;
  apiBaseUrl?: string;
  namespaceId?: string;
  resourceId?: string;
  language?: Language;
  theme?: Theme;
}): Storage {
  return {
    apiKey: response.apiKey || '',
    resourceId: response.resourceId || '',
    namespaceId: response.namespaceId || '',
    theme: response.theme || 'light',
    language: response.language || 'en',
    apiBaseUrl: response.apiBaseUrl || 'https://www.omnibox.pro',
  };
}

import type { Storage } from '../utils/shared-types.js';
import { detectBrowserLanguage } from './detect-language.js';

export function getOptions(response: Storage): Storage {
  return {
    resourceId: response.resourceId || '',
    namespaceId: response.namespaceId || '',
    theme: response.theme || 'light',
    language: response.language || detectBrowserLanguage(),
    apiBaseUrl: response.apiBaseUrl || 'https://www.omnibox.pro',
    audioEnabled: typeof response.audioEnabled === 'boolean' ? response.audioEnabled : true,
    sectionEnabled: !!response.sectionEnabled,
    selectionTextEnabled: typeof response.selectionTextEnabled === 'boolean' ? response.selectionTextEnabled : true,
    disabledSites: Array.isArray(response.disabledSites) ? response.disabledSites : [],
    keyboardShortcuts: response.keyboardShortcuts || {
      activation: 'Alt+T',
      save: 'Alt+Y',
      saveSection: 'Alt',
    },
  };
}

import { useState, useEffect, useCallback } from 'react';

import { getOptions } from '../utils/options.js';

import type { Storage } from '../utils/shared-types.js';
import { detectBrowserLanguage } from '../utils/detect-language.js';

export function useOption() {
  const [data, onData] = useState<Storage>({
    namespaceId: '',
    resourceId: '',
    theme: 'light',
    language: detectBrowserLanguage(),
    apiBaseUrl: 'https://omnibox.pro', // 默认使用 omnibox.pro
    audioEnabled: true, // 默认开启声音效果
    disabledSites: [],
  });
  const refetch = useCallback(() => {
    chrome.storage.sync.get(
      [
        'apiBaseUrl',
        'namespaceId',
        'resourceId',
        'language',
        'theme',
        'audioEnabled',
        'sectionEnabled',
        'selectionTextEnabled',
        'disabledSites',
        'keyboardShortcuts',
      ],
      (response: Storage) => {
        onData(getOptions(response));
      },
    );
  }, []);
  const onChange = useCallback((val: string | boolean | string[] | { [index: string]: string }, key?: string) => {
    const newVal = key ? { [key]: val } : (val as { [index: string]: unknown });
    chrome.storage.sync.set(newVal).then(() => {
      onData(prev => ({ ...prev, ...newVal }));
    });
  }, []);

  useEffect(refetch, [refetch]);

  return { data, refetch, onChange };
}

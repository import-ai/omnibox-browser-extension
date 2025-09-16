import { useState, useEffect, useCallback } from 'react';

import { getOptions } from '../utils/options.js';

import type { Storage } from '../utils/shared-types.js';
import { detectBrowserLanguage } from '../utils/detect-language.js';

export interface Response {
  data: Storage;
  loading: boolean;
  refetch: () => void;
  onChange: (val: unknown, key?: string) => void;
}

export function useOption() {
  const [loading, onLoading] = useState(true);
  const [data, onData] = useState<Storage>({
    namespaceId: '',
    resourceId: '',
    theme: 'light',
    language: detectBrowserLanguage(),
    apiBaseUrl: 'https://www.omnibox.pro', // 默认使用 omnibox.pro
    audioEnabled: true, // 默认开启声音效果
    disabledSites: [],
    selectionTextEnabled: true,
    keyboardShortcuts: {
      activation: 'Alt+T',
      save: 'Alt+S',
      saveSection: 'Alt',
    },
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
        onLoading(false);
      },
    );
  }, []);
  const onChange = useCallback((val: unknown, key?: string) => {
    const newVal = key ? { [key]: val } : (val as { [index: string]: unknown });
    chrome.storage.sync.set(newVal).then(() => {
      onData(prev => ({ ...prev, ...newVal }));
    });
  }, []);

  useEffect(() => {
    window.addEventListener('focus', refetch);
    refetch();
    return () => {
      window.removeEventListener('focus', refetch);
    };
  }, [refetch]);

  return { data, loading, refetch, onChange } as Response;
}

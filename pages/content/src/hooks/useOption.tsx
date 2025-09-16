import type { Storage } from '@extension/shared';
import { useState, useEffect, useCallback } from 'react';
import { getOptions, detectBrowserLanguage } from '@extension/shared';

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
    apiBaseUrl: 'https://omnibox.pro',
    disabledSites: [],
    selectionTextEnabled: true,
    keyboardShortcuts: {
      activation: 'Alt+T',
      save: 'Alt+S',
      saveSection: 'Alt',
    },
  });
  const refetch = useCallback(() => {
    chrome.runtime.sendMessage(
      {
        action: 'storage',
        args: [
          'apiBaseUrl',
          'namespaceId',
          'resourceId',
          'language',
          'theme',
          'sectionEnabled',
          'selectionTextEnabled',
          'disabledSites',
          'keyboardShortcuts',
        ],
      },
      (response: { data: Storage }) => {
        if (!response.data) {
          return;
        }
        onData(getOptions(response.data));
        onLoading(false);
      },
    );
  }, []);
  const onChange = useCallback((val: unknown, key?: string) => {
    const newVal = key ? { [key]: val } : (val as { [index: string]: unknown });
    chrome.runtime.sendMessage(
      {
        action: 'set-storage',
        args: newVal,
      },
      () => {
        onData(prev => ({ ...prev, ...newVal }));
      },
    );
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

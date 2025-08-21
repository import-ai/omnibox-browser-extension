import { useState, useEffect, useCallback } from 'react';

import { getOptions } from '../utils/options.js';

import type { Storage } from '../utils/shared-types.js';

export function useOption() {
  const [data, onData] = useState<Storage>(
    getOptions({
      apiKey: '',
      namespaceId: '',
      resourceId: '',
      theme: 'light',
      language: 'en',
      apiBaseUrl: 'https://www.omnibox.pro',
    }),
  );
  const refetch = useCallback(() => {
    chrome.storage.sync.get(['apiKey', 'apiBaseUrl', 'namespaceId', 'resourceId', 'language', 'theme'], response => {
      onData(getOptions(response));
    });
  }, []);
  const onChange = useCallback((val: string | { [index: string]: string }, key?: string) => {
    const newVal = key ? { [key]: val } : (val as { [index: string]: string });
    chrome.storage.sync.set(newVal).then(() => {
      onData(prev => ({ ...prev, ...newVal }));
    });
  }, []);

  useEffect(refetch, [refetch]);

  return { data, refetch, onChange };
}

import { useState, useEffect, useCallback } from 'react';
import type { Storage } from '../utils/shared-types.js';

export function useOption() {
  const [data, onData] = useState<Storage>({
    apiKey: '',
    namespaceId: '',
    resourceId: '',
    theme: 'light',
    language: 'en',
    apiBaseUrl: 'https://www.omnibox.pro',
  });
  const refetch = useCallback(() => {
    chrome.storage.sync.get(['apiKey', 'apiBaseUrl', 'namespaceId', 'resourceId', 'language', 'theme'], response => {
      onData({
        apiKey: response.apiKey || '',
        resourceId: response.resourceId || '',
        namespaceId: response.namespaceId || '',
        theme: response.theme || 'light',
        language: response.language || 'en',
        apiBaseUrl: response.apiBaseUrl || 'https://www.omnibox.pro',
      });
    });
  }, []);
  const onChange = useCallback((val: string | { [index: string]: string }, key?: string) => {
    const newVal = key ? { [key]: val } : (val as { [index: string]: string });
    chrome.storage.sync.set(newVal).then(() => {
      onData(prev => ({ ...prev, ...newVal }));
    });
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, refetch, onChange };
}

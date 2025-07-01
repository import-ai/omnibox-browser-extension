import { useState, useEffect } from 'react';
import type { Storage } from '../utils/shared-types.js';

export function useOption() {
  const [data, onData] = useState<Storage>({
    apiKey: '',
    namespaceId: '',
    resourceId: '',
    theme: 'light',
    language: 'zh-CN',
    apiBaseUrl: 'https://omnibox.pro',
  });
  const refetch = () => {
    chrome.storage.sync.get(['apiKey', 'apiBaseUrl', 'namespaceId', 'resourceId', 'language', 'theme'], response => {
      onData({
        apiKey: response.apiKey || '',
        resourceId: response.resourceId || '',
        namespaceId: response.namespaceId || '',
        theme: response.theme || 'light',
        language: response.language || 'zh-CN',
        apiBaseUrl: response.apiBaseUrl || 'https://omnibox.pro',
      });
    });
  };
  const onChange = (val: string | { [index: string]: string }, key?: string) => {
    const newVal = key ? { [key]: val } : (val as { [index: string]: string });
    return chrome.storage.sync.set(newVal).then(() => {
      onData(prev => ({ ...prev, ...newVal }));
    });
  };

  useEffect(() => {
    refetch();
    window.addEventListener('focus', refetch);
    return () => {
      window.removeEventListener('focus', refetch);
    };
  }, []);

  return { data, refetch, onChange };
}

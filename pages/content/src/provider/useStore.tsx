import { useState, useEffect } from 'react';

export function useStore<T>() {
  const [popup, onPopup] = useState(false);
  const [result, onResult] = useState('');
  const [toolbar, onToolbar] = useState('');
  const [disableTemp, onDisableTemp] = useState(false);
  const [status, onStatus] = useState(''); //'' | 'pending' | 'error' | 'done'

  useEffect(() => {
    chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
      sendResponse();
      if (request.action === 'toggle-popup') {
        onPopup(val => !val);
      }
      return true;
    });
  }, []);

  return {
    popup,
    onPopup,
    result,
    onResult,
    status,
    toolbar,
    onToolbar,
    disableTemp,
    onDisableTemp,
    onStatus,
  } as T;
}

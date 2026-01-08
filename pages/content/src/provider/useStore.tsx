import { useState, useEffect } from 'react';

export function useStore<T>() {
  const [popup, onPopup] = useState(false);
  const [result, onResult] = useState('');
  const [toolbar, onToolbar] = useState('');
  const [disableTemp, onDisableTemp] = useState(false);
  const [status, onStatus] = useState(''); //'' | 'pending' | 'error' | 'done'

  useEffect(() => {
    const handleMessage = (
      request: { action: string },
      _sender: chrome.runtime.MessageSender,
      sendResponse: () => void,
    ) => {
      sendResponse();
      if (request.action === 'toggle-popup') {
        onPopup(val => !val);
      }
      return true;
    };
    chrome.runtime.onMessage.addListener(handleMessage);
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
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

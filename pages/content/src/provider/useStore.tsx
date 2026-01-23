import { useState, useEffect } from 'react';
import type { RestrictionType } from '@src/widgets/restricted-popup/types';

export function useStore<T>() {
  const [popup, onPopup] = useState(false);
  const [result, onResult] = useState('');
  const [toolbar, onToolbar] = useState('');
  const [disableTemp, onDisableTemp] = useState(false);
  const [status, onStatus] = useState(''); //'' | 'pending' | 'error' | 'done'
  const [restrictedPopup, onRestrictedPopup] = useState<RestrictionType | null>(null);

  useEffect(() => {
    const handleMessage = (
      request: { action: string; restrictionType?: RestrictionType },
      _sender: chrome.runtime.MessageSender,
      sendResponse: () => void,
    ) => {
      sendResponse();
      if (request.action === 'toggle-popup') {
        onPopup(val => !val);
      } else if (request.action === 'show-restricted-popup' && request.restrictionType) {
        onRestrictedPopup(request.restrictionType);
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
    restrictedPopup,
    onRestrictedPopup,
  } as T;
}

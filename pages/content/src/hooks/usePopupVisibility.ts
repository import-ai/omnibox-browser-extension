import { useState, useEffect, useContext } from 'react';
import AppContext from './app-context';

export function usePopupVisibility() {
  const [isVisible, setIsVisible] = useState(false);
  const appContext = useContext(AppContext);

  useEffect(() => {
    const handleMessage = (message: { action: string }) => {
      if (message.action === 'toggle-popup') {
        setIsVisible(prev => !prev);
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  useEffect(() => {
    if (!isVisible || !appContext?.root) return;

    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target as Element;

      // Check if click is outside the extension root element
      if (!appContext.root.contains(target)) {
        setIsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleMouseDown, true);

    return () => {
      document.removeEventListener('mousedown', handleMouseDown, true);
    };
  }, [isVisible, appContext]);

  return { isVisible, setIsVisible };
}

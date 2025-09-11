import { useState, useEffect, useCallback } from 'react';

export function useFeedbackVisibility() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMessage = (message: { action: string; data?: unknown }) => {
      if (message.action === 'show-feedback') {
        // Show feedback notification
        setIsVisible(true);

        // Auto-hide after 3 seconds
        setTimeout(() => {
          setIsVisible(false);
        }, 3000);
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  // Method to programmatically show feedback
  const showFeedback = useCallback(() => {
    setIsVisible(true);

    // Auto-hide after 3 seconds
    setTimeout(() => {
      setIsVisible(false);
    }, 3000);
  }, []);

  return { isVisible, setIsVisible, showFeedback };
}

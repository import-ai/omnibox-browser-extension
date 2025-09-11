import { useState, useEffect, useCallback } from 'react';

interface NotificationData {
  status: 'pending' | 'error' | 'done' | '';
  result: string;
}

export function useNotificationVisibility() {
  const [isVisible, setIsVisible] = useState(false);
  const [notificationData, setNotificationData] = useState<NotificationData>({ status: '', result: '' });

  useEffect(() => {
    const handleMessage = (message: { action: string; data?: NotificationData }) => {
      if (message.action === 'show-notification') {
        if (message.data) {
          setNotificationData(message.data);
        }

        // Show notification
        setIsVisible(true);

        // Auto-hide after 3 seconds (only for done and error states)
        if (message.data?.status === 'done' || message.data?.status === 'error') {
          setTimeout(() => {
            setIsVisible(false);
            setNotificationData({ status: '', result: '' });
          }, 3000);
        }
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  const showNotification = useCallback((data?: NotificationData) => {
    if (data) {
      setNotificationData(data);
    }
    setIsVisible(true);

    // Auto-hide after 3 seconds (only for done and error states)
    if (data?.status === 'done' || data?.status === 'error') {
      setTimeout(() => {
        setIsVisible(false);
        setNotificationData({ status: '', result: '' });
      }, 3000);
    }
  }, []);

  return { isVisible, setIsVisible, showNotification: showNotification, notificationData: notificationData };
}

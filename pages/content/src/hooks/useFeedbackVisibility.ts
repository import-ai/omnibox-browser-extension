import { useState, useEffect, useCallback } from 'react';

interface FeedbackData {
  status: 'pending' | 'error' | 'done' | '';
  result: string;
}

export function useFeedbackVisibility() {
  const [isVisible, setIsVisible] = useState(false);
  const [feedbackData, setFeedbackData] = useState<FeedbackData>({ status: '', result: '' });

  useEffect(() => {
    const handleMessage = (message: { action: string; data?: FeedbackData }) => {
      if (message.action === 'show-notification') {
        // Update feedback data
        if (message.data) {
          setFeedbackData(message.data);
        }

        // Show feedback notification
        setIsVisible(true);

        // Auto-hide after 3 seconds (only for done and error states)
        if (message.data?.status === 'done' || message.data?.status === 'error') {
          setTimeout(() => {
            setIsVisible(false);
            setFeedbackData({ status: '', result: '' });
          }, 3000);
        }
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);

    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage);
    };
  }, []);

  // Method to programmatically show feedback
  const showFeedback = useCallback((data?: FeedbackData) => {
    if (data) {
      setFeedbackData(data);
    }
    setIsVisible(true);

    // Auto-hide after 3 seconds (only for done and error states)
    if (data?.status === 'done' || data?.status === 'error') {
      setTimeout(() => {
        setIsVisible(false);
        setFeedbackData({ status: '', result: '' });
      }, 3000);
    }
  }, []);

  return { isVisible, setIsVisible, showFeedback, feedbackData };
}

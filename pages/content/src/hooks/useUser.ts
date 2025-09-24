import { useEffect, useState, useCallback } from 'react';

interface IProps {
  baseUrl: string;
}

export function useUser(props: IProps) {
  const { baseUrl } = props;
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; username?: string }>({
    id: '',
  });
  const refetch = useCallback(() => {
    if (!baseUrl) {
      return;
    }
    chrome.runtime.sendMessage(
      {
        action: 'fetch',
        url: `${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}/api/v1/user/me`,
      },
      response => {
        setLoading(false);
        if (response.error && response.error.includes('401')) {
          setUser({ id: '' });
          return;
        }
        if (!response.data) {
          return;
        }
        setUser(response.data);
      },
    );
  }, [baseUrl]);

  useEffect(() => {
    window.addEventListener('focus', refetch);
    refetch();
    return () => {
      window.removeEventListener('focus', refetch);
    };
  }, [refetch]);

  return { user, loading, refetch };
}

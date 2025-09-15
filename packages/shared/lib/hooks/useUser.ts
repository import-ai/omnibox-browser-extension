import { useEffect, useState } from 'react';

interface IProps {
  baseUrl: string;
}

export function useUser(props: IProps) {
  const { baseUrl } = props;
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; username?: string }>({
    id: '',
  });
  const refetch = () => {
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
        if (!response.data) {
          return;
        }
        setUser(response.data);
      },
    );
  };

  useEffect(refetch, [baseUrl]);

  return { user, loading, refetch };
}

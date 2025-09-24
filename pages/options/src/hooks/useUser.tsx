import { useEffect, useState, useCallback } from 'react';
import { axios } from '@extension/shared';

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
    axios(`${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}/api/v1/user/me`)
      .then(response => {
        setUser(response);
      })
      .catch(() => {
        setUser({ id: '' });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [baseUrl]);

  useEffect(() => {
    window.addEventListener('focus', refetch);
    refetch();
    return () => {
      window.removeEventListener('focus', refetch);
    };
  }, [baseUrl, refetch]);

  return { user, loading, refetch };
}

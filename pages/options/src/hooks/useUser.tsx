import { useEffect, useState } from 'react';
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
  const refetch = () => {
    if (!baseUrl) {
      return;
    }
    axios(`${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}/api/v1/user/me`).then(response => {
      setLoading(false);
      setUser(response);
    });
  };

  useEffect(refetch, [baseUrl]);

  return { user, loading, refetch };
}

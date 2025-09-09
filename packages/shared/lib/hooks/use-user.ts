import { axios } from '../utils/axios.js';
import { useEffect, useState } from 'react';

interface IProps {
  baseUrl: string;
}

export default function useUser(props: IProps) {
  const { baseUrl } = props;
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({
    id: '',
  });
  const refetch = () => {
    if (!baseUrl) {
      return;
    }
    axios(`${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}/api/v1/user/me`)
      .then(setUser)
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(refetch, []);

  return { user, loading, refetch };
}

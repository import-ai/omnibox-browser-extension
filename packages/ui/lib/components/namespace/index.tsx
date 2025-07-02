import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { useState, useEffect } from 'react';
import type { Namespace } from '@extension/shared';
import axios from '@extension/shared/lib/utils/axios';
import { ChevronDown, LoaderCircle, Home } from 'lucide-react';

interface IProps {
  apiKey: string;
  modal?: boolean;
  label: string;
  baseUrl?: string;
  namespaceId: string;
  onClick?: () => void;
}

export function Namespace(props: IProps) {
  const { apiKey, modal, baseUrl, label, namespaceId, onClick } = props;
  const [loading, setLoading] = useState(false);
  const [data, onData] = useState<Namespace>({ id: '', name: '' });

  useEffect(() => {
    if (!baseUrl || !namespaceId || !apiKey) {
      onData({
        id: '',
        name: '',
      });
      return;
    }
    setLoading(true);
    axios(`${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}/api/v1/namespaces/${namespaceId}`, {
      apiKey,
    })
      .then(response => {
        onData({
          id: response.id,
          name: response.name,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [baseUrl, apiKey, namespaceId]);

  return (
    <div
      className={cn('flex items-center justify-between', {
        'px-4 pt-2 pb-1': !modal,
      })}>
      <div className="flex items-center space-x-3">
        <Home className="size-4" />
        <span className="text-sm">{label}</span>
      </div>
      <Button disabled={!apiKey} onClick={onClick} variant="outline" className="font-normal w-40 justify-between">
        <span className="max-w-[94px] truncate">{data.name}</span>
        {loading ? (
          <LoaderCircle className="transition-transform animate-spin" />
        ) : (
          <ChevronDown className="size-4 ml-2" />
        )}
      </Button>
    </div>
  );
}

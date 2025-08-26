import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { LazyInput } from '../lazyInput';
import { useState, useEffect } from 'react';
import { Separator } from '../ui/separator';
import type { Namespace } from '@extension/shared';
import { Search, LoaderCircle } from 'lucide-react';
import axios from '@extension/shared/lib/utils/axios';

interface IProps {
  baseUrl?: string;
  backText?: string;
  namespaceId: string;
  placeholder: string;
  onCancel: () => void;
  onChange: (val: string | { [index: string]: string }, key?: string) => void;
}

export function ChooseNamespace(props: IProps) {
  const { backText, baseUrl, namespaceId, placeholder, onCancel, onChange } = props;
  const [search, onSearch] = useState('');
  const [lazy, onLazy] = useState('');
  const [loading, onLoading] = useState(false);
  const [data, onData] = useState<Array<Namespace>>([]);
  const handleChange = (itemId: string) => {
    onLazy(itemId);
    axios(`${baseUrl}/api/v1/namespaces/${itemId}/root`, {
      query: { namespace_id: itemId },
    })
      .then(response => {
        const privateData = response['private'];
        if (privateData) {
          onChange({
            resourceId: privateData.id,
            namespaceId: itemId,
          });
        } else {
          onChange({
            resourceId: '',
            namespaceId: itemId,
          });
        }
        onSearch('');
        onCancel();
      })
      .finally(() => {
        onLazy('');
      });
  };

  useEffect(() => {
    if (!baseUrl) {
      return;
    }
    onLoading(true);
    axios(`${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}/api/v1/namespaces`)
      .then(onData)
      .finally(() => {
        onLoading(false);
      });
  }, [baseUrl]);

  return (
    <div>
      {backText && (
        <>
          <div className="py-1">
            <Button variant="ghost" className="hover:bg-transparent" onClick={onCancel}>
              {backText}
            </Button>
          </div>
          <Separator className="mb-4" />
        </>
      )}
      <div className="relative mb-2 px-4">
        {loading ? (
          <LoaderCircle className="absolute left-6 top-[10px] size-4 opacity-50 transition-transform animate-spin" />
        ) : (
          <Search className="absolute left-6 top-[10px] size-4 opacity-50" />
        )}
        <LazyInput value={search} onChange={onSearch} className="pl-8 rounded-sm" placeholder={placeholder} />
      </div>
      <div className="pb-2 min-h-60 max-h-80 overflow-y-auto">
        {data
          .filter(item => (search ? item.name.includes(search) : true))
          .map(item => {
            const name = item.name || 'untitled';
            return (
              <Button
                key={item.id}
                variant="ghost"
                onClick={() => handleChange(item.id)}
                className={cn('w-full h-auto whitespace-normal justify-start items-start font-normal rounded-none', {
                  'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50': item.id === namespaceId,
                })}>
                <Badge
                  variant="secondary"
                  className={cn({
                    'px-2': lazy === item.id,
                  })}>
                  {lazy === item.id ? <LoaderCircle className="transition-transform animate-spin" /> : name.charAt(0)}
                </Badge>
                <div className="text-left">{name}</div>
              </Button>
            );
          })}
      </div>
    </div>
  );
}

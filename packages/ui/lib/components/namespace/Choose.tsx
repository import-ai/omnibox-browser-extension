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
  apiKey: string;
  baseUrl?: string;
  backText?: string;
  namespaceId: string;
  placeholder: string;
  onCancel: () => void;
  onChange: (val: string | { [index: string]: string }, key?: string) => void;
}

export function ChooseNamespace(props: IProps) {
  const { backText, apiKey, baseUrl, namespaceId, placeholder, onCancel, onChange } = props;
  const [search, onSearch] = useState('');
  const [loading, onLoading] = useState(false);
  const [data, onData] = useState<Array<Namespace>>([]);

  useEffect(() => {
    if (!baseUrl || !apiKey) {
      return;
    }
    onLoading(true);
    axios(`${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}/api/v1/namespaces`, {
      apiKey,
    })
      .then(onData)
      .finally(() => {
        onLoading(false);
      });
  }, [baseUrl, apiKey]);

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
                className={cn('w-full h-auto whitespace-normal justify-start items-start font-normal rounded-none', {
                  'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50': item.id === namespaceId,
                })}
                onClick={() => {
                  onChange({
                    resourceId: '',
                    namespaceId: item.id,
                  });
                  onSearch('');
                  onCancel();
                }}>
                <Badge variant="secondary">{name.charAt(0)}</Badge>
                <div className="text-left">{name}</div>
              </Button>
            );
          })}
      </div>
    </div>
  );
}

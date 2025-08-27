import { Button } from '../ui/button';
import { LazyInput } from '../lazyInput';
import FormResource from './FormResource';
import { Separator } from '../ui/separator';
import { useState, useEffect } from 'react';
import type { Resource } from '@extension/shared';
import axios from '@extension/shared/lib/utils/axios';
import { Search, LoaderCircle } from 'lucide-react';

interface IProps {
  untitled: string;
  privateText: string;
  teamspaceText: string;
  baseUrl?: string;
  backText?: string;
  resourceId: string;
  namespaceId: string;
  placeholder: string;
  onCancel: () => void;
  onChange: (val: string | { [index: string]: string }, key?: string) => void;
}

export function ChooseResource(props: IProps) {
  const {
    untitled,
    privateText,
    teamspaceText,
    backText,
    baseUrl,
    placeholder,
    resourceId,
    namespaceId,
    onCancel,
    onChange,
  } = props;
  const [search, onSearch] = useState('');
  const [loading, onLoading] = useState(false);
  const [data, onData] = useState<{
    root: Array<Resource>;
    resources: Array<Resource>;
  }>({
    root: [],
    resources: [],
  });

  useEffect(() => {
    if (!baseUrl || !namespaceId) {
      return;
    }
    onLoading(true);
    if (!search) {
      axios(`${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}/api/v1/namespaces/${namespaceId}/root`, {
        query: { namespace_id: namespaceId },
      })
        .then(response => {
          const root: Array<Resource> = [];
          const resources: Array<Resource> = [];
          Object.keys(response).forEach(spaceType => {
            const item = response[spaceType];
            if (!item.id) {
              return;
            }
            root.push({ ...item, space_type: spaceType });
            if (Array.isArray(item.children) && item.children.length > 0) {
              resources.push(...item.children);
            }
          });
          onData({ root, resources });
        })
        .finally(() => {
          onLoading(false);
        });
      return;
    }
    axios(
      `${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}/api/v1/namespaces/${namespaceId}/resources/search`,
      {
        query: {
          name: encodeURIComponent(search),
        },
      },
    )
      .then(response => {
        onData({
          root: [],
          resources: response,
        });
      })
      .finally(() => {
        onLoading(false);
      });
  }, [baseUrl, search, namespaceId]);

  return (
    <div className="w-full">
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
        {data.root.length > 0 && (
          <>
            <Button
              disabled
              variant="ghost"
              className="w-full whitespace-normal justify-start items-start rounded-none pb-0 h-7">
              Root
            </Button>
            {data.root.map(item => (
              <FormResource
                data={item}
                key={item.id}
                untitled={untitled}
                onCancel={onCancel}
                onSearch={onSearch}
                onChange={onChange}
                resourceId={resourceId}
                privateText={privateText}
                teamspaceText={teamspaceText}
              />
            ))}
          </>
        )}
        {data.resources.length > 0 && (
          <>
            <Button
              disabled
              variant="ghost"
              className="w-full whitespace-normal justify-start items-start rounded-none pb-0 h-7">
              Resource
            </Button>
            {data.resources.map(item => (
              <FormResource
                data={item}
                key={item.id}
                untitled={untitled}
                onCancel={onCancel}
                onSearch={onSearch}
                onChange={onChange}
                resourceId={resourceId}
                privateText={privateText}
                teamspaceText={teamspaceText}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

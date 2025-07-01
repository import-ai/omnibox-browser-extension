import { Button } from '../ui/button';
import { LazyInput } from '../lazyInput';
import FormResource from './FormResource';
import { Separator } from '../ui/separator';
import { useState, useEffect } from 'react';
import type { Resource } from '@extension/shared';
import axios from '@extension/shared/lib/utils/axios';
import { Search, LoaderCircle } from 'lucide-react';

interface IProps {
  apiKey: string;
  modal?: boolean;
  baseUrl?: string;
  resourceId: string;
  namespaceId: string;
  onCancel: () => void;
  onChange: (val: string | { [index: string]: string }, key?: string) => void;
}

export function ChooseResource(props: IProps) {
  const { apiKey, modal, baseUrl, resourceId, namespaceId, onCancel, onChange } = props;
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
    if (!baseUrl || !namespaceId || !apiKey) {
      return;
    }
    onLoading(true);
    if (!search) {
      Promise.all(
        ['private', 'teamspace'].map(spaceType =>
          axios(`${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}/api/v1/namespaces/${namespaceId}/root`, {
            apiKey,
            query: { namespace_id: namespaceId, space_type: spaceType },
          }),
        ),
      )
        .then(response => {
          const root: Array<Resource> = [];
          const resources: Array<Resource> = [];
          response.forEach(item => {
            if (!item.id) {
              return;
            }
            root.push(item);
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
        apiKey,
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
  }, [baseUrl, search, apiKey, namespaceId]);

  return (
    <div className="w-full">
      {!modal && (
        <>
          <div className="py-1">
            <Button variant="ghost" className="hover:bg-transparent" onClick={onCancel}>
              Back
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
        <LazyInput value={search} onChange={onSearch} className="pl-8 rounded-sm" placeholder="Search for resource" />
      </div>
      <div className="pb-2 min-h-[130px] max-h-80 overflow-y-auto">
        {data.root.length > 0 && (
          <>
            <Button
              disabled
              variant="ghost"
              className="w-full h-auto whitespace-normal justify-start items-start rounded-none pb-0 h-7">
              Root
            </Button>
            {data.root.map(item => (
              <FormResource
                data={item}
                key={item.id}
                onCancel={onCancel}
                onSearch={onSearch}
                onChange={onChange}
                resourceId={resourceId}
              />
            ))}
          </>
        )}
        {data.resources.length > 0 && (
          <>
            <Button
              disabled
              variant="ghost"
              className="w-full h-auto whitespace-normal justify-start items-start rounded-none pb-0 h-7">
              Resource
            </Button>
            {data.resources.map(item => (
              <FormResource
                data={item}
                key={item.id}
                onCancel={onCancel}
                onSearch={onSearch}
                onChange={onChange}
                resourceId={resourceId}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

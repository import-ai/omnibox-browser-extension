import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { useState, useEffect } from 'react';
import type { Resource } from '@extension/shared';
import { each } from '@extension/shared/lib/utils/each';
import { axios } from '@extension/shared/lib/utils/axios';
import { ChevronDown, FolderClosed, LoaderCircle } from 'lucide-react';

interface IProps {
  modal?: boolean;
  baseUrl?: string;
  label: string;
  untitled: string;
  privateText: string;
  teamspaceText: string;
  resourceId: string;
  namespaceId: string;
  onClick?: () => void;
}

export function Resource(props: IProps) {
  const { modal, untitled, baseUrl, label, privateText, teamspaceText, namespaceId, resourceId, onClick } = props;
  const [loading, setLoading] = useState(false);
  const [data, onData] = useState<Resource>({
    id: '',
    name: '',
  });

  useEffect(() => {
    if (!baseUrl || !namespaceId || !resourceId) {
      onData({
        id: '',
        name: '',
      });
      return;
    }
    setLoading(true);
    axios(`${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}/api/v1/namespaces/${namespaceId}/root`, {
      query: { namespace_id: namespaceId },
    })
      .then(root => {
        let match = false;
        each(Object.keys(root), spaceType => {
          const item = root[spaceType];
          if (item.id === resourceId) {
            onData({ id: resourceId, name: spaceType === 'private' ? privateText : teamspaceText });
            match = true;
            return true;
          }
          return;
        });
        if (match) {
          return;
        }
        axios(
          `${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}/api/v1/namespaces/${namespaceId}/resources/${resourceId}`,
        ).then(response => {
          onData({
            id: resourceId,
            name: response.name || untitled,
          });
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [baseUrl, namespaceId, resourceId, privateText, teamspaceText, untitled]);

  return (
    <div
      className={cn('flex items-center justify-between', {
        'px-4 pt-1 pb-2': !modal,
      })}>
      <div className="flex items-center space-x-3">
        <FolderClosed className="size-4" />
        <span className="text-sm">{label}</span>
      </div>
      <Button variant="outline" className="font-normal w-40 justify-between" onClick={onClick}>
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

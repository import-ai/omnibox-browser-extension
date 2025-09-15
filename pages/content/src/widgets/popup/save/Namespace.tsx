import { useState, useEffect, useRef } from 'react';
import type { Response, Namespace } from '@extension/shared';
import { LoaderCircle, ChevronDown, Check } from 'lucide-react';
import { cn, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@extension/ui';

interface IProps extends Omit<Response, 'data' | 'refetch'> {
  loading: boolean;
  baseUrl: string;
  namespaceId: string;
  container: HTMLElement | null;
}

export function Namespace(props: IProps) {
  const { baseUrl, loading, namespaceId, onChange, container } = props;
  const [open, onOpen] = useState(false);
  const [fetching, onFetching] = useState(false);
  const [switching, onSwitching] = useState('');
  const [data, onData] = useState<Namespace[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const namespace = data.find(item => item.id === namespaceId);
  const handleOpen = () => {
    onOpen(true);
  };
  const handleClose = () => {
    onOpen(false);
  };
  const handleChange = (itemId: string) => {
    onSwitching(itemId);
    chrome.runtime.sendMessage(
      {
        action: 'fetch',
        query: { namespace_id: itemId },
        url: `${baseUrl}/api/v1/namespaces/${itemId}/root`,
      },
      response => {
        onSwitching('');
        if (!response.data) {
          onOpen(false);
          return;
        }
        const privateData = response.data['private'];
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
        onOpen(false);
      },
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!dropdownRef.current) return;

      const rect = dropdownRef.current.getBoundingClientRect();
      const isInside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (!isInside) {
        handleClose();
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  useEffect(() => {
    if (loading || !baseUrl) {
      return;
    }
    onFetching(true);
    chrome.runtime.sendMessage(
      {
        action: 'fetch',
        url: `${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}/api/v1/namespaces`,
      },
      response => {
        onFetching(false);
        if (!response.data) {
          return;
        }
        onData(response.data);
      },
    );
  }, [loading, baseUrl]);

  if (data.length <= 1) {
    return null;
  }

  return (
    <>
      <DropdownMenu open={open}>
        <DropdownMenuTrigger onClick={handleOpen} className="flex items-center gap-[4px] outline-0">
          <span className="text-[16px] font-[600] text-[#171717] dark:text-[#f5f5f5] max-w-[170px] truncate">
            {namespace?.name}
          </span>
          {fetching ? (
            <LoaderCircle className="size-[16px] transition-transform animate-spin" />
          ) : (
            <ChevronDown className="size-[16px]" />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          ref={dropdownRef}
          side="bottom"
          align="end"
          className="rounded-[12px] border-none max-w-[200px]"
          container={container}>
          {data.map(item => (
            <DropdownMenuItem
              key={item.id}
              onClick={() => handleChange(item.id)}
              className={cn(
                'py-2 cursor-pointer justify-between rounded-[8px] hover:bg-gray-100 dark:hover:bg-gray-400',
                {
                  'bg-gray-100 dark:bg-gray-400': item.id === namespaceId,
                },
              )}>
              <span className="text-[#171717] dark:text-white">{item.name || 'untitled'}</span>
              {switching === item.id ? (
                <LoaderCircle className="size-5 text-[#171717 transition-transform animate-spin" />
              ) : (
                item.id === namespaceId && <Check className="size-5 text-[#171717]" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <span className="text-sm text-[#8F959E]">的</span>
    </>
  );
}

import { ChooseResource } from './Choose';
import { useRef, useState, useEffect } from 'react';
import { each } from '@extension/shared';
import type { Resource } from '@extension/shared';
import { ChevronDown, LoaderCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@extension/ui';
import { useTranslation } from 'react-i18next';

interface IProps {
  loading: boolean;
  baseUrl: string;
  resourceId: string;
  namespaceId: string;
  container: HTMLElement | null;
  onChange: (val: unknown, key?: string) => void;
}

export function Resource(props: IProps) {
  const { container, baseUrl, loading, namespaceId, resourceId, onChange } = props;
  const { t } = useTranslation();
  const [open, onOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [fetching, onFetching] = useState(false);
  const [data, onData] = useState<Resource>({
    id: '',
    name: '',
  });
  const handleOpen = () => {
    onOpen(true);
  };
  const handleChange = (val: unknown, key?: string) => {
    onChange(val, key);
    onOpen(false);
  };

  useEffect(() => {
    if (loading || !baseUrl || !namespaceId || !resourceId) {
      return;
    }
    onFetching(true);
    chrome.runtime.sendMessage(
      {
        action: 'fetch',
        url: `${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}/api/v1/namespaces/${namespaceId}/root`,
      },
      root => {
        onFetching(false);
        if (!root.data) {
          return;
        }
        let match = false;
        each(Object.keys(root.data), spaceType => {
          const item = root.data[spaceType];
          if (item.id === resourceId) {
            onData({ id: resourceId, name: spaceType === 'private' ? t('personal') : t('team') });
            match = true;
            return true;
          }
          return;
        });
        if (match) {
          return;
        }
        chrome.runtime.sendMessage(
          {
            action: 'fetch',
            url: `${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}/api/v1/namespaces/${namespaceId}/resources/${resourceId}`,
          },
          response => {
            if (!response.data) {
              return;
            }
            onData({
              id: resourceId,
              name: response.data.name || t('untitled'),
            });
          },
        );
      },
    );
  }, [t, loading, baseUrl, namespaceId, resourceId]);

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
        onOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <DropdownMenu open={open}>
      <DropdownMenuTrigger onClick={handleOpen} className="flex items-center gap-[4px] outline-0">
        <span className="text-[16px] font-[600] text-[#171717] dark:text-white max-w-[180px] truncate">
          {data.name}
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
        container={container}
        className="rounded-[12px] border-none w-[200px] min-w-[200px]">
        {open && (
          <ChooseResource
            loading={loading}
            baseUrl={baseUrl}
            onChange={handleChange}
            namespaceId={namespaceId}
            resourceId={resourceId}
          />
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

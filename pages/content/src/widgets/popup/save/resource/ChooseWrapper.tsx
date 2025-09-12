import { Users } from 'lucide-react';
import FormResource from './FormResource';
import { useState, useEffect } from 'react';
import type { Resource } from '@extension/shared';
import { DropdownMenuItem } from '@extension/ui';
import { useTranslation } from 'react-i18next';

interface IProps {
  baseUrl: string;
  namespaceId: string;
  resourceId: string;
  data: Array<Resource>;
  onSearch: (search: string) => void;
  onChange: (val: unknown, key?: string) => void;
}

export function ChooseWrapper(props: IProps) {
  const { data, baseUrl, namespaceId, onSearch, resourceId, onChange } = props;
  const { t } = useTranslation();
  const [open, onOpen] = useState(false);

  useEffect(() => {
    chrome.runtime.sendMessage(
      {
        action: 'fetch',
        url: `${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}/api/v1/namespaces/${namespaceId}/members`,
      },
      response => {
        if (!response.data) {
          return;
        }
        onOpen(response.data.length > 1);
      },
    );
  }, [baseUrl, namespaceId]);

  if (!open || data.length <= 0) {
    return null;
  }

  return (
    <>
      <DropdownMenuItem className="py-2 gap-[6px] rounded-[8px] cursor-pointer dark:text-white hover:bg-gray-100 dark:hover:bg-gray-400">
        <Users />
        <span className="text-[#171717] dark:text-white">{t('team')}</span>
      </DropdownMenuItem>
      {data.map(item => (
        <FormResource data={item} key={item.id} onSearch={onSearch} onChange={onChange} resourceId={resourceId} />
      ))}
    </>
  );
}

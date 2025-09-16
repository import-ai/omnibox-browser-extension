import { Check, Users } from 'lucide-react';
import FormResource from './FormResource';
import { useState, useEffect } from 'react';
import type { Resource } from '@extension/shared';
import { cn, DropdownMenuItem } from '@extension/ui';
import { useTranslation } from 'react-i18next';

interface IProps {
  baseUrl: string;
  namespaceId: string;
  resourceId: string;
  teamRootId: string;
  data: Array<Resource>;
  onSearch: (search: string) => void;
  onChange: (val: unknown, key?: string) => void;
}

export function ChooseWrapper(props: IProps) {
  const { data, baseUrl, teamRootId, namespaceId, onSearch, resourceId, onChange } = props;
  const { t } = useTranslation();
  const [open, onOpen] = useState(false);
  const handleTeamClick = () => {
    onChange(teamRootId, 'resourceId');
    onSearch('');
  };

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
      <DropdownMenuItem
        onClick={handleTeamClick}
        className={cn(
          'py-2 gap-[6px] rounded-[8px] justify-between cursor-pointer dark:text-white hover:bg-gray-100 dark:hover:bg-gray-400',
          {
            'bg-gray-100 dark:bg-gray-400': teamRootId === resourceId,
          },
        )}>
        <div className="flex items-center gap-[8px]">
          <Users className="size-4" />
          <span className="text-[#171717] dark:text-white">{t('team')}</span>
        </div>
        {teamRootId === resourceId && <Check className="size-5 text-[#171717" />}
      </DropdownMenuItem>
      {data.map(item => (
        <FormResource data={item} key={item.id} onSearch={onSearch} onChange={onChange} resourceId={resourceId} />
      ))}
    </>
  );
}

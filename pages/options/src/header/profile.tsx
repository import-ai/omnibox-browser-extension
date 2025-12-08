import { useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { axios } from '@extension/shared';
import { useTranslation } from 'react-i18next';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@extension/ui';

interface IProps {
  user: { id: string; username?: string };
  baseUrl: string;
  namespaceId: string;
  refetch: () => void;
  userRefetch?: () => void;
  onChange?: (val: unknown, key?: string) => void;
}

export function Profile(props: IProps) {
  const { user, baseUrl, namespaceId, refetch, onChange, userRefetch } = props;
  const { t } = useTranslation();
  const handleOmnibox = () => {
    if (!baseUrl) {
      return;
    }
    location.href = baseUrl;
  };
  const handleLogout = () => {
    axios(`${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}/api/v1/logout`, {
      method: 'POST',
    }).finally(() => {
      chrome.storage.sync.remove(['namespaceId', 'resourceId']).then(() => {
        refetch();
        userRefetch?.();
      });
    });
  };

  useEffect(() => {
    if (!baseUrl || namespaceId) {
      return;
    }
    chrome.runtime.sendMessage(
      {
        action: 'fetch',
        url: `${baseUrl}/api/v1/namespaces`,
      },
      response => {
        if (!response.data) {
          return;
        }
        if (response.data.length <= 0) {
          return;
        }
        const namespaceId = response.data[0].id;
        chrome.runtime.sendMessage(
          {
            action: 'fetch',
            url: `${baseUrl}/api/v1/namespaces/${namespaceId}/root`,
          },
          root => {
            if (!root.data) {
              return;
            }
            const privateData = root.data['private'];
            if (!privateData) {
              return;
            }
            if (onChange) {
              onChange({
                namespaceId,
                resourceId: privateData.id,
              });
            }
          },
        );
      },
    );
  }, [namespaceId, baseUrl, onChange]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-[6px] outline-0">
        <span className="text-[#333333] dark:text-gray-200">{user.username || '--'}</span>
        <ChevronDown className="size-[16px] text-[#37352F] dark:text-gray-400 opacity-[0.35]" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end" className="w-[200px] dark:border-neutral-800">
        <DropdownMenuItem
          className="cursor-pointer justify-between hover:bg-gray-100 dark:hover:bg-[#171717]"
          onClick={handleOmnibox}>
          {t('my_omnibox')}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer justify-between hover:bg-gray-100 dark:hover:bg-[#171717]"
          onClick={handleLogout}>
          {t('logout_button')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

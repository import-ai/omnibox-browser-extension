import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@extension/ui';
import { useTranslation } from 'react-i18next';

interface IProps {
  baseUrl: string;
  namespaceId: string;
  refetch: () => void;
}

export function Profile(props: IProps) {
  const { baseUrl, namespaceId, refetch } = props;
  const { t } = useTranslation();
  const [namespaceName, onNamespaceName] = useState('');
  const handleOmnibox = () => {
    if (!baseUrl) {
      return;
    }
    location.href = baseUrl;
  };
  const handleLogout = () => {
    chrome.storage.sync.remove(['apiBaseUrl', 'namespaceId', 'resourceId']).then(refetch);
  };

  useEffect(() => {
    if (!namespaceId || !baseUrl) {
      return;
    }
    chrome.runtime.sendMessage(
      {
        action: 'fetch',
        url: `${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}/api/v1/namespaces/${namespaceId}`,
      },
      response => {
        if (!response.data) {
          return;
        }
        onNamespaceName(response.data.name);
      },
    );
  }, [namespaceId, baseUrl]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-[6px] outline-0">
        <span className="text-[#333333] dark:text-gray-200">{namespaceName}</span>
        <ChevronDown className="size-[16px] text-[#37352F] dark:text-gray-400 opacity-[0.35]" />
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end" className="min-w-[126px]">
        <DropdownMenuItem
          className="cursor-pointer justify-between hover:bg-gray-100 dark:hover:bg-gray-400"
          onClick={handleOmnibox}>
          {t('my_omnibox')}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer justify-between hover:bg-gray-100 dark:hover:bg-gray-400"
          onClick={handleLogout}>
          {t('logout_button')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

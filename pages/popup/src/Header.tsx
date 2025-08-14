import { useTranslation } from 'react-i18next';
import { LogOut, Settings } from 'lucide-react';
import { Button, Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@extension/ui';

interface IProps {
  refetch: () => void;
}

export default function Header({ refetch }: IProps) {
  const { t } = useTranslation();
  const handleOption = () => {
    chrome.runtime.openOptionsPage();
  };
  const handleLogout = () => {
    chrome.storage.sync.remove(['apiKey', 'namespaceId', 'resourceId'], refetch);
  };

  return (
    <div className="flex items-center justify-between gap-2 pl-4 pr-1 py-2">
      <h1 className="text-base font-medium">{t('extensionName')}</h1>
      <div className="flex items-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" onClick={handleOption}>
                <Settings />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t('setting_title')}</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" onClick={handleLogout}>
                <LogOut />
              </Button>
            </TooltipTrigger>
            <TooltipContent>{t('logout')}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

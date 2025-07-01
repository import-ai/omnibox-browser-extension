import { t } from '@extension/i18n';
import { Button } from '@extension/ui';
import { ChevronRight, Settings } from 'lucide-react';

export default function Setting() {
  const handleOption = () => {
    chrome.runtime.openOptionsPage();
  };

  return (
    <Button
      variant="ghost"
      onClick={handleOption}
      className="w-full flex items-center justify-between rounded-none font-normal h-12">
      <div className="flex items-center space-x-3">
        <Settings />
        <span>{t('setting_title')}</span>
      </div>
      <ChevronRight />
    </Button>
  );
}

import useApp from '@src/hooks/useApp';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Bolt, MessageCircleWarning } from 'lucide-react';
import { Button, Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@extension/ui';

interface IProps {
  baseUrl: string;
}

export default function Header(props: IProps) {
  const { baseUrl } = props;
  const { container } = useApp();
  const [target, onTarget] = useState<HTMLElement | null>(null);
  const { t } = useTranslation();
  const handleFeedback = () => {
    chrome.runtime.sendMessage({
      action: 'create-tab',
      url: `${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}/feedback`,
    });
  };
  const handleSetting = () => {
    chrome.runtime.sendMessage({
      action: 'open-options',
    });
  };

  useEffect(() => {
    const containerRef = container.querySelector('.js-popup') as HTMLElement;
    if (containerRef) {
      onTarget(containerRef);
    }
  }, [container]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="size-[16px]">
          <img src={chrome.runtime.getURL('icon-128.png')} alt="logo" />
        </div>
        <div className="text-sm font-[600] text-foreground">OmniBox</div>
      </div>
      <div className="flex items-center gap-[12px]">
        <TooltipProvider>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" className="size-[20px]" onClick={handleFeedback}>
                <MessageCircleWarning color="#8F959E" />
              </Button>
            </TooltipTrigger>
            <TooltipContent container={target}>{t('feedback')}</TooltipContent>
          </Tooltip>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button size="icon" variant="ghost" className="size-[20px]" onClick={handleSetting}>
                <Bolt color="#8F959E" />
              </Button>
            </TooltipTrigger>
            <TooltipContent container={target}>{t('settings')}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}

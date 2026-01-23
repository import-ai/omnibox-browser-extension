import { useTranslation } from 'react-i18next';
import { Bolt, HouseIcon, MessageCircleWarning } from 'lucide-react';
import { Button, Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@extension/ui';
import useApp from '@src/hooks/useApp';
import zIndex from '@src/utils/zindex';
import { useState, useEffect } from 'react';
import type { RestrictionType } from './types';

interface Props {
  restrictionType: RestrictionType;
  onClose: () => void;
  baseUrl: string;
}

export function RestrictedPopup({ restrictionType, onClose, baseUrl }: Props) {
  const { t, i18n } = useTranslation();
  const { container } = useApp();
  const zIndexValue = zIndex();
  const [target, onTarget] = useState<HTMLElement | null>(null);
  const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

  const subtitleKey = {
    'browser-internal': 'restrictedBrowserInternal',
    webstore: 'restrictedBrowserInternal',
    'omnibox-pro': 'restrictedOmniboxPro',
  }[restrictionType];

  const handleNamespace = () => {
    chrome.runtime.sendMessage({
      action: 'create-tab',
      url: `${normalizedBaseUrl}/user/login?from=extension`,
    });
  };

  const handleFeedback = () => {
    chrome.runtime.sendMessage({
      action: 'create-tab',
      url: `${normalizedBaseUrl}/feedback?lang=${i18n.language}`,
    });
  };

  const handleSetting = () => {
    chrome.runtime.sendMessage({
      action: 'open-options',
    });
  };

  useEffect(() => {
    const containerRef = container.querySelector('.js-restricted-popup') as HTMLElement;
    if (containerRef) {
      onTarget(containerRef);
    }
  }, [container]);

  useEffect(() => {
    chrome.runtime.sendMessage({
      action: 'track',
      name: 'open_restricted_popup',
      payload: {
        once: true,
        section: 'ext_restricted_popup',
        restrictionType,
      },
    });
  }, [restrictionType]);

  return (
    <>
      {/* Overlay */}
      <div onClick={onClose} className="fixed left-0 top-0 w-full h-full" style={{ zIndex: zIndexValue }} />
      {/* Popup */}
      <div
        className="js-restricted-popup fixed top-7 right-7 rounded-2xl px-4 py-3 w-[288px] bg-background text-foreground shadow-[0px_4px_12px_rgba(0,0,0,0.1)] dark:bg-[#262626] dark:shadow-[0px_4px_20px_-1px_rgba(0,0,0,0.3)]"
        style={{ zIndex: zIndexValue + 1 }}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-4">
              <img src={chrome.runtime.getURL('icon-128.png')} alt="logo" />
            </div>
            <div className="text-sm font-semibold text-foreground dark:text-white">{t('name')}</div>
          </div>
          <div className="flex items-center gap-3">
            <TooltipProvider>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost" className="size-5" onClick={handleNamespace}>
                    <HouseIcon color="#8F959E" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent container={target}>{t('open_namespace')}</TooltipContent>
              </Tooltip>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost" className="size-5" onClick={handleFeedback}>
                    <MessageCircleWarning color="#8F959E" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent container={target}>{t('feedback')}</TooltipContent>
              </Tooltip>
              <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost" className="size-5" onClick={handleSetting}>
                    <Bolt color="#8F959E" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent container={target}>{t('settings')}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center justify-center text-center py-5">
          <div className="text-base font-semibold text-foreground dark:text-white mb-3">{t('restrictedTitle')}</div>
          <div className="text-sm text-[#B8BCC8]">{t(subtitleKey)}</div>
        </div>
      </div>
    </>
  );
}

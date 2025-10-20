import { toast } from 'sonner';
import { X } from 'lucide-react';
import copy from 'copy-to-clipboard';
import useApp from '@src/hooks/useApp';
import { SaveIcon } from '@src/icon/save';
import { CopyIcon } from '@src/icon/copy';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { Storage } from '@extension/shared';
import { useAction } from '@src/provider/useAction';
import { getFaviconUrl, clearSelection } from './utils';
import {
  Badge,
  Button,
  Separator,
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@extension/ui';

interface IProps {
  data: Storage;
  toolbar: string;
  selectionAction?: boolean;
  onDestory?: () => void;
  onToolbar: (toolbar: string) => void;
  onDisableTemp: (disableTemp: boolean) => void;
  onChange: (val: unknown, key?: string) => void;
}

export function Toolbars(props: IProps) {
  const { data, toolbar, onToolbar, onChange, onDestory, onDisableTemp, selectionAction } = props;
  const { container } = useApp();
  const { onResult, onStatus } = useAction();
  const { t } = useTranslation();
  const [loading, onLoading] = useState(false);
  const [target, onTarget] = useState<HTMLElement | null>(null);
  const handleCancel = () => {
    clearSelection();
    onToolbar('');
    if (onDestory) {
      onDestory();
    }
  };
  const handleCopy = () => {
    if (
      copy(toolbar, {
        format: 'text/plain',
      })
    ) {
      toast(t('copy_success'), { position: 'top-center' });
    } else {
      toast(t('copy_failed'), { position: 'top-center' });
    }
    handleCancel();
    chrome.runtime.sendMessage({
      action: 'track',
      name: selectionAction ? 'copy_text_in_extension_section' : 'copy_text_in_extension_underline',
    });
  };
  const handleSave = () => {
    onLoading(true);
    const { apiBaseUrl, resourceId, namespaceId } = data;
    chrome.runtime.sendMessage(
      {
        resourceId,
        namespaceId,
        action: 'collect',
        baseUrl: apiBaseUrl,
        pageUrl: document.URL,
        pageTitle: document.title,
        data: `<html><head><title>${document.title}</title></head><body><p>${toolbar}</p></body></html>`,
      },
      response => {
        onLoading(false);
        handleCancel();
        if (response && response.error) {
          onStatus('error');
          onResult(response.error);
        } else {
          onStatus('done');
          onResult(response.data.resource_id);
        }
      },
    );
    chrome.runtime.sendMessage({
      action: 'track',
      name: selectionAction ? 'save_to_omnibox_in_extension_section' : 'save_to_omnibox_in_extension_underline',
    });
  };
  const handleDisableTemp = () => {
    onDisableTemp(true);
    handleCancel();
  };
  const handleDisableSite = () => {
    const disabledSites = Array.isArray(data.disabledSites) ? data.disabledSites : [];
    const index = disabledSites.findIndex(item => item.host === location.hostname);
    if (index < 0) {
      disabledSites.push({
        icon: getFaviconUrl(),
        host: location.hostname,
      });
      onChange(disabledSites, 'disabledSites');
    }
    handleCancel();
  };
  const handleDisabled = () => {
    onChange(false, 'selectionTextEnabled');
    handleCancel();
  };
  const openOptionsPage = () => {
    chrome.runtime.sendMessage({
      action: 'open-options',
    });
  };

  useEffect(() => {
    const containerRef = container.querySelector('.js-toolbar') as HTMLElement;
    if (containerRef) {
      onTarget(containerRef);
    }
  }, [container]);

  return (
    <Badge
      rootClassName="flex items-center px-[10px] py-[4px] gap-[2px]"
      slot={
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="outline-0">
            <Button
              size="icon"
              variant="ghost"
              className="size-[16px] bg-[#333] opacity-30 text-white rounded-full hover:bg-[#333] hover:text-white">
              <X className="size-[10px]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" align="start" container={target} className="min-w-[126px] rounded-[6px]">
            <DropdownMenuItem
              onClick={handleDisableTemp}
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-400">
              {t('hide_until_next_visit')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDisableSite}
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-400">
              {t('disable_for_site')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDisabled}
              className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-400">
              {t('disable_globally')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-[12px] gap-0">
              {t('re_enable_prefix')}
              <Button
                size="sm"
                variant="ghost"
                onClick={openOptionsPage}
                className="p-0 h-auto w-auto text-[12px] text-[#1167FE]">
                {t('settings')}
              </Button>
              {t('re_enable_suffix')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      }>
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button size="icon" variant="ghost" className="size-[24px]" onClick={handleCopy}>
              <CopyIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent container={target}>{t('copy_tooltip')}</TooltipContent>
        </Tooltip>
        <Separator orientation="vertical" className="h-[16px] bg-[#EDEDF2]" />
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <Button size="icon" loading={loading} variant="ghost" className="size-[24px]" onClick={handleSave}>
              <SaveIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent container={target}>{t('save_to_omnibox')}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Badge>
  );
}

import useApp from '@src/hooks/useApp';
import { useState, useEffect } from 'react';
import { SectionIcon } from '@src/icon/section';
import type { Storage } from '@extension/shared';
import { Switch, Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '@extension/ui';
import { useTranslation } from 'react-i18next';

export interface IProps {
  data: Storage;
  onChange: (val: unknown, key: string) => void;
}

export function Section(props: IProps) {
  const { data, onChange } = props;
  const { container } = useApp();
  const { t } = useTranslation();
  const [target, onTarget] = useState<HTMLElement | null>(null);
  const handleSectionToggle = (checked: boolean) => {
    onChange(checked, 'sectionEnabled');
  };

  useEffect(() => {
    const containerRef = container.querySelector('.js-popup') as HTMLElement;
    if (containerRef) {
      onTarget(containerRef);
    }
  }, [container]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-[8px]">
        <SectionIcon />
        <span className="text-sm text-[#555555] dark:text-[#8F959E]">{t('selected_area')}</span>
      </div>
      <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-[6px]">
              <span className="text-xs text-[#8F959E]">{t('hold_option_key')}</span>
              <Switch className="scale-[0.8]" checked={!!data.sectionEnabled} onCheckedChange={handleSectionToggle} />
            </div>
          </TooltipTrigger>
          <TooltipContent container={target}>{t('hold_option_tooltip')}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

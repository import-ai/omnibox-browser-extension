import React from 'react';
import { Switch, Kbd, KbdGroup } from '@extension/ui';
import type { IProps } from '@src/types';
import { SectionIcon } from '../icon/section';
import { useTranslation } from 'react-i18next';
import { parseShortcutToDisplay } from '@extension/shared';

export function Section(props: IProps) {
  const { data, onChange } = props;
  const { t } = useTranslation();
  const handleSectionToggle = (checked: boolean) => {
    onChange(checked, 'sectionEnabled');
  };
  const sectionKeyBoard = data.keyboardShortcuts
    ? parseShortcutToDisplay(data.keyboardShortcuts.saveSection || '')
    : '';

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-[8px]">
        <SectionIcon />
        <span className="font-[500]">{t('specific_area')}</span>
      </div>
      <div className="flex items-center gap-[6px]">
        <div className="text-xs flex items-center gap-1 text-[#8F959E]">
          <span>{t('hold_option_key')}</span>
          <KbdGroup>
            {sectionKeyBoard.split('+').map((val, index) => (
              <React.Fragment key={val}>
                {index > 0 && <span className="opacity-50">+</span>}
                <Kbd>{val}</Kbd>
              </React.Fragment>
            ))}
          </KbdGroup>
        </div>
        <Switch
          className="scale-[0.8] dark:data-[state=unchecked]:bg-gray-600 dark:data-[state=checked]:bg-white"
          checked={!!data.sectionEnabled}
          onCheckedChange={handleSectionToggle}
        />
      </div>
    </div>
  );
}

import { EditIcon } from '../icon/edit';
import { Switch } from '@extension/ui';
import type { IProps } from '@src/types';
import { useTranslation } from 'react-i18next';

export function SectionText(props: IProps) {
  const { data, onChange } = props;
  const { t } = useTranslation();
  const handleSelectionTextToggle = (checked: boolean) => {
    onChange(checked, 'selectionTextEnabled');
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-[8px]">
        <EditIcon />
        <span className="font-[500]">{t('selection_menu')}</span>
      </div>
      <Switch
        className="scale-[0.8] data-[state=unchecked]:bg-gray-600 data-[state=checked]:bg-white"
        checked={!!data.selectionTextEnabled}
        onCheckedChange={handleSelectionTextToggle}
      />
    </div>
  );
}

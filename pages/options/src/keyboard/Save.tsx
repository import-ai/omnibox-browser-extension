import type { IProps } from '@src/types';
import { ShortcutInput } from './ShortcutInput';
import { useTranslation } from 'react-i18next';

export function Save(props: IProps) {
  const { data, onChange } = props;
  const { t } = useTranslation();
  const handleShortcutChange = (value: string) => {
    onChange(
      {
        ...data.keyboardShortcuts,
        save: value,
      },
      'keyboardShortcuts',
    );
  };

  return (
    <div className="flex items-center justify-between">
      <span className="font-[500]">{t('save_shortcut')}</span>
      <ShortcutInput className="w-[200px]" value={data.keyboardShortcuts?.save || ''} onChange={handleShortcutChange} />
    </div>
  );
}

import type { IProps } from '@src/types';
import { ShortcutInput } from './ShortcutInput';
import { useTranslation } from 'react-i18next';

export function Section(props: IProps) {
  const { data, onChange } = props;
  const { t } = useTranslation();
  const handleShortcutChange = (value: string) => {
    onChange(
      {
        ...data.keyboardShortcuts,
        saveSection: value,
      },
      'keyboardShortcuts',
    );
  };

  return (
    <div className="flex items-center justify-between">
      <span className="font-[500]">{t('section_shortcut')}</span>
      <ShortcutInput
        className="w-[200px]"
        value={data.keyboardShortcuts?.saveSection || ''}
        onChange={handleShortcutChange}
      />
    </div>
  );
}

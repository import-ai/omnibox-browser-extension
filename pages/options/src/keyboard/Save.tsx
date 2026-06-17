import type { IProps } from '@src/types';
import { ShortcutInput } from './ShortcutInput';
import { useTranslation } from 'react-i18next';

interface SaveProps extends Omit<IProps, 'onChange'> {
  onShortcutChange: (value: string) => boolean | void;
}

export function Save(props: SaveProps) {
  const { data, onShortcutChange } = props;
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between">
      <span className="font-[500]">{t('save_shortcut')}</span>
      <ShortcutInput className="w-[200px]" value={data.keyboardShortcuts?.save || ''} onChange={onShortcutChange} />
    </div>
  );
}

import type { IProps } from '@src/types';
import { ShortcutInput } from './ShortcutInput';
import { useTranslation } from 'react-i18next';

interface SectionProps extends Omit<IProps, 'onChange'> {
  error?: string;
  onShortcutChange: (value: string) => boolean | void;
}

export function Section(props: SectionProps) {
  const { data, onShortcutChange, error } = props;
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between">
      <span className="font-[500]">{t('section_shortcut')}</span>
      <ShortcutInput
        className="w-[200px]"
        value={data.keyboardShortcuts?.saveSection || ''}
        onChange={onShortcutChange}
        error={error}
      />
    </div>
  );
}

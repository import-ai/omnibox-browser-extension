import type { IProps } from '@src/types';
import { ShortcutInput } from './ShortcutInput';
import { useTranslation } from 'react-i18next';

interface ActivationProps extends Omit<IProps, 'onChange'> {
  error?: string;
  onShortcutChange: (value: string) => boolean | void;
}

export function Activation(props: ActivationProps) {
  const { data, onShortcutChange, error } = props;
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between">
      <span className="font-[500]">{t('activation_shortcut')}</span>
      <ShortcutInput
        className="w-[200px]"
        value={data.keyboardShortcuts?.activation || ''}
        onChange={onShortcutChange}
        error={error}
      />
    </div>
  );
}

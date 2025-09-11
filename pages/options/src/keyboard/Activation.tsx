import type { IProps } from '@src/types';
import { ShortcutInput } from './ShortcutInput';

export function Activation(props: IProps) {
  const { data, onChange } = props;
  const handleShortcutChange = (value: string) => {
    onChange(
      {
        ...data.keyboardShortcuts,
        activation: value,
      },
      'keyboardShortcuts',
    );
  };

  return (
    <div className="flex items-center justify-between">
      <span className="font-[500]">激活拓展程序快捷键</span>
      <ShortcutInput
        className="w-[200px]"
        value={data.keyboardShortcuts?.activation || ''}
        onChange={handleShortcutChange}
      />
    </div>
  );
}

import type { IProps } from '@src/types';
import { ShortcutInput } from './ShortcutInput';

export function Section(props: IProps) {
  const { data, onChange } = props;
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
      <span className="font-[500]">保存指定区域快捷键</span>
      <ShortcutInput
        className="w-[200px]"
        value={data.keyboardShortcuts?.saveSection || ''}
        onChange={handleShortcutChange}
      />
    </div>
  );
}

import type { IProps } from '@src/types';
import { ShortcutInput } from './ShortcutInput';

export function Save(props: IProps) {
  const { data, onChange } = props;
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
      <span className="font-[500]">保存到OmniBox快捷键</span>
      <ShortcutInput className="w-[200px]" value={data.keyboardShortcuts?.save || ''} onChange={handleShortcutChange} />
    </div>
  );
}

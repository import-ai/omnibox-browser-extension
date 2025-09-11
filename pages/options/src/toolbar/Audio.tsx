import { Switch } from '@extension/ui';
import type { IProps } from '@src/types';

export function Audio(props: IProps) {
  const { data, onChange } = props;
  const handleAudioToggle = (checked: boolean) => {
    onChange(checked, 'audioEnabled');
  };

  return (
    <div className="flex items-center justify-between">
      <span className="font-[500]">启动声音效果</span>
      <Switch className="scale-[0.8]" checked={!!data.audioEnabled} onCheckedChange={handleAudioToggle} />
    </div>
  );
}

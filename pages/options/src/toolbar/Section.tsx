import { SectionIcon } from '../icon/section';
import { Switch } from '@extension/ui';
import type { IProps } from '@src/types';

export function Section(props: IProps) {
  const { data, onChange } = props;
  const handleSectionToggle = (checked: boolean) => {
    onChange(checked, 'sectionEnabled');
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-[8px]">
        <SectionIcon />
        <span className="font-[500]">指定区域</span>
      </div>
      <div className="flex items-center gap-[6px]">
        <span className="text-xs text-[#8F959E]">按住 ⌥</span>
        <Switch className="scale-[0.8]" checked={!!data.sectionEnabled} onCheckedChange={handleSectionToggle} />
      </div>
    </div>
  );
}

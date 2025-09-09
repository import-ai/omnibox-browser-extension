import { SectionIcon } from '@src/icon/section';
import { Switch } from '@extension/ui';

export function Section() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-[8px]">
        <SectionIcon />
        <span className="text-sm text-[#555555]">指定区域</span>
      </div>
      <div className="flex items-center gap-[6px]">
        <span className="text-xs text-[#8F959E]">按住 ⌥</span>
        <Switch className="scale-[0.8]" />
      </div>
    </div>
  );
}

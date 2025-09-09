import { EditIcon } from '@src/icon/edit';
import { Switch } from '@extension/ui';

export function SectionText() {
  return (
    <div className="flex items-center justify-between mt-[20px]">
      <div className="flex items-center gap-[8px]">
        <EditIcon />
        <span className="text-sm text-[#555555]">划线菜单</span>
      </div>
      <Switch className="scale-[0.8]" />
    </div>
  );
}

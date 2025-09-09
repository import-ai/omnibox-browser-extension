import { LazyInput } from '@extension/ui';
import type { IProps } from '@src/types';

export function Save(props: IProps) {
  const { data, onChange } = props;

  return (
    <div className="flex items-center justify-between">
      <span className="font-[500]">保存到OmniBox快捷键</span>
      <LazyInput className="w-[200px]" value={data.apiBaseUrl} onChange={onChange} />
    </div>
  );
}

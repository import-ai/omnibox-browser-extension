import { LazyInput } from '@extension/ui';
import type { IProps } from '@src/types';

export function Activation(props: IProps) {
  const { data, onChange } = props;

  return (
    <div className="flex items-center justify-between">
      <span className="font-[500]">激活拓展程序快捷键</span>
      <LazyInput className="w-[200px]" value={data.apiBaseUrl} onChange={onChange} />
    </div>
  );
}

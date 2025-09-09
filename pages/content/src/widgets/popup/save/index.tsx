// import { toast } from 'sonner';
import { useRef } from 'react';
import { Resource } from './Resource';
import { Namespace } from './Namespace';
import type { Storage } from '@extension/shared';
// import { useTranslation } from 'react-i18next';
// import { choose, cancelChoose } from './action';

interface IProps {
  data: Storage;
}

export function Save(props: IProps) {
  const containerRef = useRef(null);

  return (
    <div ref={containerRef} className="flex flex-wrap items-center gap-[8px] my-[20px]">
      <span className="text-sm text-[#8F959E]">保存到</span>
      <Namespace container={containerRef.current} />
      <span className="text-sm text-[#8F959E]">的</span>
      <Resource container={containerRef.current} />
    </div>
  );
}

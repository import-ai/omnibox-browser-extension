import zIndex from '@src/utils/zindex';
import { useRef } from 'react';

interface IProps {
  children: React.ReactNode;
}

export function Wrapper(props: IProps) {
  const { children } = props;
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className={`fixed left-1/2 -translate-x-1/2 top-[50px] rounded-[16px] min-w-[260px] bg-background text-foreground`}
      style={{
        zIndex: zIndex(),
      }}>
      {children}
    </div>
  );
}

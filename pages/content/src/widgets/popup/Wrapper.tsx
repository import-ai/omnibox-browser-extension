import { Toaster } from 'sonner';
import zIndex from '@src/utils/zindex';

interface IProps {
  children: React.ReactNode;
  isVisible: boolean;
}

export function Wrapper(props: IProps) {
  const { children, isVisible } = props;

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`fixed top-[28px] right-[28px] rounded-[16px] px-[16px] py-[14px] min-w-[288px] bg-background text-foreground shadow-lg`}
      style={{
        zIndex: zIndex(),
      }}>
      <Toaster />
      {children}
    </div>
  );
}

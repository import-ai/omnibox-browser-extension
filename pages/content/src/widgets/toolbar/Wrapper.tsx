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
      className={`fixed top-[100px] right-[50%] min-w-[70px] text-foreground bg-white rounded-[8px] shadow-md`}
      style={{
        zIndex: zIndex(),
      }}>
      {children}
    </div>
  );
}

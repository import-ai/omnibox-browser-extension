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
      className={`fixed top-[100px] right-[50%] min-w-[70px] text-foreground bg-white rounded-[8px] shadow-[0px 4px 18px 0px rgba(0, 0, 0, 0.1)]`}
      style={{
        zIndex: zIndex(),
      }}>
      {children}
    </div>
  );
}

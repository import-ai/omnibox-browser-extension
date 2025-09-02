import zIndex from '@src/utils/zindex';

interface IProps {
  children: React.ReactNode;
}

export function Wrapper(props: IProps) {
  const { children } = props;

  return (
    <div
      className={`fixed top-[28px] right-[28px] rounded-lg min-w-[288px] shadow-lg bg-background text-foreground`}
      style={{
        zIndex: zIndex(),
      }}>
      {children}
    </div>
  );
}

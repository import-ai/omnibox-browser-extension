import zIndex from '@src/utils/zindex';

interface IProps {
  children: React.ReactNode;
}

export function Wrapper(props: IProps) {
  const { children } = props;

  return (
    <div
      className={`js-popup fixed top-[28px] right-[28px] rounded-[16px] px-[16px] py-[14px] w-[288px] bg-background text-foreground shadow-[0px_4px_12px_rgba(0,0,0,0.1)]`}
      style={{
        zIndex: zIndex(),
      }}>
      {children}
    </div>
  );
}

import zIndex from '@src/utils/zindex';

interface IProps {
  toolbar: string;
  point: { x: number; y: number };
  children: React.ReactNode;
}

export function Wrapper(props: IProps) {
  const { point, toolbar, children } = props;

  if (toolbar.length <= 0) {
    return null;
  }

  return (
    <div
      className={`js-toolbar fixed top-0 bottom-auto left-0 right-auto min-w-[70px] text-foreground bg-background rounded-[8px] shadow-[0px_4px_18px_0px_rgba(0,0,0,0.1)]`}
      style={{
        zIndex: zIndex(),
        top: `${point.y}px`,
        left: `${point.x}px`,
        transform: 'translate(-50%, -100%)',
      }}>
      {children}
    </div>
  );
}

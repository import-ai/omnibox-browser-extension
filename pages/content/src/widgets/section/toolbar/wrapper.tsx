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

  // Use absolute positioning so toolbar scrolls with page
  // point is clientX/clientY, add scroll offset to get document position
  const x = point.x + window.scrollX;
  const y = point.y + window.scrollY;

  return (
    <div
      className={`js-toolbar absolute min-w-[70px] text-foreground bg-background rounded-[8px] shadow-[0px_4px_18px_0px_rgba(0,0,0,0.1)]`}
      style={{
        zIndex: zIndex(),
        left: x,
        top: y,
        transform: 'translate(-50%, -100%)',
      }}>
      {children}
    </div>
  );
}

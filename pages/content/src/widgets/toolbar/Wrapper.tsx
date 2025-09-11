import zIndex from '@src/utils/zindex';

interface Position {
  x: number;
  y: number;
}

interface IProps {
  children: React.ReactNode;
  isVisible: boolean;
  position: Position;
}

export function Wrapper(props: IProps) {
  const { children, isVisible, position } = props;

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`absolute min-w-[70px] text-foreground bg-white rounded-[8px] shadow-md`}
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        transform: 'translate(-50%, -100%)',
        zIndex: zIndex(),
      }}>
      {children}
    </div>
  );
}

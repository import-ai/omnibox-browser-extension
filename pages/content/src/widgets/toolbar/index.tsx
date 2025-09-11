import { Toolbars } from './toolbars';
import { Wrapper } from './Wrapper';

interface Position {
  x: number;
  y: number;
}

interface ToolbarContainerProps {
  isVisible: boolean;
  position: Position;
}

export function ToolbarContainer({ isVisible, position }: ToolbarContainerProps) {
  return (
    <Wrapper isVisible={isVisible} position={position}>
      <Toolbars />
    </Wrapper>
  );
}

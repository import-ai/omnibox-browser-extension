import { Toolbars } from './toolbars';
import { Wrapper } from './Wrapper';

interface ToolbarContainerProps {
  isVisible: boolean;
}

export function ToolbarContainer({ isVisible }: ToolbarContainerProps) {
  return (
    <Wrapper isVisible={isVisible}>
      <Toolbars />
    </Wrapper>
  );
}

import Choose from './Choose';
import Feedback from './Feedback';
import { Wrapper } from './Wrapper';

interface FeedbackContainerProps {
  isVisible: boolean;
}

export function FeedbackContainer({ isVisible }: FeedbackContainerProps) {
  return (
    <Wrapper isVisible={isVisible}>
      <div>
        <Feedback />
        <Choose />
      </div>
    </Wrapper>
  );
}

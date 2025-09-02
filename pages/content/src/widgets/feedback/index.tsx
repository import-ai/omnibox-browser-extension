import Choose from './Choose';
import Feedback from './Feedback';
import { Wrapper } from './Wrapper';

export function FeedbackContainer() {
  return (
    <Wrapper>
      <div>
        <Feedback />
        <Choose />
      </div>
    </Wrapper>
  );
}

import Choose from './Choose';
import Notification from './Notification';
import { Wrapper } from './Wrapper';

interface FeedbackData {
  status?: 'pending' | 'error' | 'done' | '';
  result?: string;
}

interface FeedbackContainerProps {
  isVisible: boolean;
  data?: FeedbackData;
}

export function FeedbackContainer({ isVisible, data }: FeedbackContainerProps) {
  return (
    <Wrapper isVisible={isVisible}>
      <div>
        <Notification status={data?.status} result={data?.result} />
        <Choose />
      </div>
    </Wrapper>
  );
}

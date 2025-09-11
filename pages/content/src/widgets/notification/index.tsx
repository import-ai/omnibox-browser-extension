import Choose from './Choose';
import Notification from './Notification';
import { Wrapper } from './Wrapper';

interface NotificationData {
  status?: 'pending' | 'error' | 'done' | '';
  result?: string;
}

interface NotificationContainerProps {
  isVisible: boolean;
  data?: NotificationData;
}

export function NotificationContainer({ isVisible, data }: NotificationContainerProps) {
  return (
    <Wrapper isVisible={isVisible}>
      <div>
        <Notification status={data?.status} result={data?.result} />
        <Choose />
      </div>
    </Wrapper>
  );
}

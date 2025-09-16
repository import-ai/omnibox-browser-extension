import { Wrapper } from './Wrapper';
import { Notification } from './Notification';
import type { Storage } from '@extension/shared';
import { useAction } from '@src/provider/useAction';

export interface IProps {
  data: Storage;
}

export function FeedbackContainer(props: IProps) {
  const { data } = props;
  const { status, result, onStatus, onResult } = useAction();

  if (!status) {
    return null;
  }

  return (
    <Wrapper>
      {status && <Notification data={data} status={status} onStatus={onStatus} result={result} onResult={onResult} />}
    </Wrapper>
  );
}

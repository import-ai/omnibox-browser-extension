import { Feedback } from './Feedback';
import { Wrapper } from './Wrapper';
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
      {status && <Feedback data={data} status={status} onStatus={onStatus} result={result} onResult={onResult} />}
    </Wrapper>
  );
}

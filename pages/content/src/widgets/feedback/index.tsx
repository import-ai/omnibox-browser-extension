import { Choose } from './Choose';
import { Feedback } from './Feedback';
import { Wrapper } from './Wrapper';
import type { Storage } from '@extension/shared';
import { useAction } from '@src/provider/useAction';

export interface IProps {
  data: Storage;
}

export function FeedbackContainer(props: IProps) {
  const { data } = props;
  const { status, result, onStatus, onResult, choosing, onChoosing } = useAction();

  if (!status && !choosing) {
    return null;
  }

  return (
    <Wrapper>
      <div>
        {status && <Feedback data={data} status={status} onStatus={onStatus} result={result} onResult={onResult} />}
        {choosing && <Choose choosing={choosing} onChoosing={onChoosing} />}
      </div>
    </Wrapper>
  );
}

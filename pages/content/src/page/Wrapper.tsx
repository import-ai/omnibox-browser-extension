import Choose from './Choose';
import Feedback from './Feedback';
import zIndex from '../utils/zindex';
import DraggableBox from './Draggable';
import type { Storage } from '@extension/shared';

export default function Wrapper(props: Storage) {
  return (
    <DraggableBox zIndex={zIndex()}>
      <div>
        <Feedback {...props} />
        <Choose />
      </div>
    </DraggableBox>
  );
}

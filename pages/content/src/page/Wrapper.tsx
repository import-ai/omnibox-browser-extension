import Choose from './Choose';
import Feedback from './Feedback';
import zIndex from '../utils/zindex';
import DraggableBox from './Draggable';

export default function Wrapper() {
  return (
    <DraggableBox zIndex={zIndex()}>
      <div>
        <Feedback />
        <Choose />
      </div>
    </DraggableBox>
  );
}

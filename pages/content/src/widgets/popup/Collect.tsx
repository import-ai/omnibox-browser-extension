import { Button } from '@extension/ui';
import { BoxIcon } from '@src/icon/box';

interface IProps {
  loading: boolean;
  onClick: () => void;
}

export default function Collect(props: IProps) {
  const { onClick } = props;

  return (
    <Button variant="default" onClick={onClick} className="w-full flex items-center rounded-[8px] mt-[20px]">
      <BoxIcon />
      <span>保存到 OmniBox</span>
    </Button>
  );
}

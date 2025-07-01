import Theme from './theme';
import Language from './language';
import type { Storage } from '@extension/shared';

interface IProps {
  data: Storage;
  onChange: (val: string | { [index: string]: string }, key?: string) => void;
}

export default function CommonForm(props: IProps) {
  const { data, onChange } = props;

  return (
    <div className="space-y-6">
      <Theme data={data.theme} onChange={onChange} />
      <Language data={data.language} onChange={onChange} />
    </div>
  );
}

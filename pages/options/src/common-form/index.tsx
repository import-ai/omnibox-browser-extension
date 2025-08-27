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
    <div className="px-2 space-y-6">
      <Theme baseUrl={data.apiBaseUrl} data={data.theme} onChange={onChange} />
      <Language baseUrl={data.apiBaseUrl} data={data.language} onChange={onChange} />
    </div>
  );
}

import Access from './Access';
import Resource from './Resource';
import Namespace from './Namespace';
import type { Storage } from '@extension/shared';

interface IProps {
  data: Storage;
  onChange: (val: string | { [index: string]: string }, key?: string) => void;
}

export default function SettingForm(props: IProps) {
  const { data, onChange } = props;

  return (
    <div className="px-2 space-y-6">
      <Access baseUrl={data.apiBaseUrl} apiKey={data.apiKey} onChange={onChange} />
      <Namespace apiKey={data.apiKey} baseUrl={data.apiBaseUrl} namespaceId={data.namespaceId} onChange={onChange} />
      <Resource
        apiKey={data.apiKey}
        onChange={onChange}
        baseUrl={data.apiBaseUrl}
        resourceId={data.resourceId}
        namespaceId={data.namespaceId}
      />
    </div>
  );
}

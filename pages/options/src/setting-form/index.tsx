import Access from './Access';
import Resource from './Resource';
import Namespace from './Namespace';
import type { Storage } from '@extension/shared';

interface IProps {
  data: Storage;
  refetch: () => void;
  onChange: (val: string | { [index: string]: string }, key?: string) => void;
}

export default function SettingForm(props: IProps) {
  const { data, onChange, refetch } = props;

  return (
    <div className="px-2 space-y-6">
      <Access baseUrl={data.apiBaseUrl} namespaceId={data.namespaceId} onChange={onChange} refetch={refetch} />
      <Namespace baseUrl={data.apiBaseUrl} namespaceId={data.namespaceId} onChange={onChange} />
      <Resource
        onChange={onChange}
        baseUrl={data.apiBaseUrl}
        resourceId={data.resourceId}
        namespaceId={data.namespaceId}
      />
    </div>
  );
}

// import Theme from './theme';
import Language from './language';
import type { IProps } from '@src/types';
// import { Separator } from '@extension/ui';

export function Common(props: Omit<IProps, 'refetch'>) {
  const { data, onChange, loading } = props;

  return (
    <>
      {/* <Theme loading={loading} baseUrl={data.apiBaseUrl} data={data.theme} onChange={onChange} />
      <Separator className="my-[24px] bg-[#F2F2F2] dark:bg-gray-600" /> */}
      <Language loading={loading} baseUrl={data.apiBaseUrl} data={data.language} onChange={onChange} />
    </>
  );
}

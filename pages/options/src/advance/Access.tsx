import { LazyInput } from '@extension/ui';
import type { IProps } from '@src/types';
import { useTranslation } from 'react-i18next';

export default function Access(props: IProps) {
  const { data, onChange } = props;
  const { t } = useTranslation();
  const handleApiBaseUrlChange = (value: string) => {
    onChange(value, 'apiBaseUrl');
  };

  return (
    <div className="flex items-center justify-between">
      <span className="font-[500]">{t('access')}</span>
      <LazyInput className="w-[200px]" value={data.apiBaseUrl} onChange={handleApiBaseUrlChange} />
    </div>
  );
}

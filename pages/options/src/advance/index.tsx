import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { axios } from '@extension/shared';
import { Input, Button } from '@extension/ui';
import type { IProps } from '@src/types';
import { useTranslation } from 'react-i18next';

export function Advance(props: IProps) {
  const { data, onChange } = props;
  const { t } = useTranslation();
  const [value, onValue] = useState(data.apiBaseUrl);
  const handleApiBaseUrlChange = () => {
    if (!value) {
      return;
    }
    onChange({
      apiBaseUrl: value,
      namespaceId: '',
      resourceId: '',
    });
    axios(`${value.endsWith('/') ? value.slice(0, -1) : value}/api/v1/user/me`);
    toast(t('save_success'), { position: 'bottom-right' });
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const val = event.target.value;
    if (val.length <= 0) {
      onValue('');
    } else {
      onValue(val);
    }
  };

  useEffect(() => {
    onValue(data.apiBaseUrl);
  }, [data.apiBaseUrl]);

  return (
    <div className="flex items-center justify-between">
      <span className="font-[500]">{t('access')}</span>
      <div className="flex items-center justify-center gap-2">
        <Input type="url" className="w-[200px] dark:bg-background" value={value} onChange={handleChange} />
        <Button variant="default" onClick={handleApiBaseUrlChange}>
          {t('save')}
        </Button>
      </div>
    </div>
  );
}

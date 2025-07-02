import { ServerIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LazyInput, Button } from '@extension/ui';
import { isValidStrictHttpRootDomain } from '@src/utils';

interface IProps {
  baseUrl: string;
  apiKey: string;
  onChange: (val: string | { [index: string]: string }, key?: string) => void;
}

export default function Access(props: IProps) {
  const { apiKey, onChange, baseUrl } = props;
  const { t } = useTranslation();
  const handleLogin = () => {
    if (!baseUrl || !isValidStrictHttpRootDomain(baseUrl)) {
      return;
    }
    chrome.tabs.create({
      url: `${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}/user/login?from=extension`,
    });
  };
  const handleChange = (val: string) => {
    onChange({
      apiKey: '',
      namespaceId: '',
      resourceId: '',
      apiBaseUrl: val,
    });
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <ServerIcon className="size-4" />
        <span className="text-sm">{t('access')}</span>
      </div>
      <div className="flex gap-2">
        <LazyInput className="w-64" value={baseUrl} onChange={handleChange} />
        {apiKey ? (
          <Button disabled>{t('apikey_done')}</Button>
        ) : (
          <Button onClick={handleLogin} disabled={!isValidStrictHttpRootDomain(baseUrl)}>
            {t('apikey_submit')}
          </Button>
        )}
      </div>
    </div>
  );
}

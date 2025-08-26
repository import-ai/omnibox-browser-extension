import { useState, useEffect } from 'react';
import { ServerIcon } from 'lucide-react';
import { initResources } from '../utils';
import { useTranslation } from 'react-i18next';
import { LazyInput, Button } from '@extension/ui';
import { isValidStrictHttpRootDomain } from '@src/utils';
import axios from '@extension/shared/lib/utils/axios';

interface IProps {
  baseUrl: string;
  refetch: () => void;
  namespaceId: string;
  onChange: (val: string | { [index: string]: string }, key?: string) => void;
}

export default function Access(props: IProps) {
  const { onChange, refetch, baseUrl, namespaceId } = props;
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
      namespaceId: '',
      resourceId: '',
      apiBaseUrl: val,
    });
  };

  useEffect(() => {
    if (!baseUrl) {
      return;
    }
    axios(`${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}/api/v1/user/me`).then(() => {
      initResources(refetch);
    });
  }, [baseUrl, refetch]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <ServerIcon className="size-4" />
        <span className="text-sm">{t('access')}</span>
      </div>
      <div className="flex gap-2">
        <LazyInput className="w-64" value={baseUrl} onChange={handleChange} />
        {namespaceId ? (
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

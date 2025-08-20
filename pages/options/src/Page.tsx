import { useEffect } from 'react';
import { Toaster } from 'sonner';
import CommonForm from './common-form';
import SettingForm from './setting-form';
import { useOption } from '@extension/shared';
import { useTranslation } from 'react-i18next';
import axios from '@extension/shared/lib/utils/axios';
import { getOptions } from '@extension/shared/lib/utils/options';

export default function Page() {
  const { data, onChange, refetch } = useOption();
  const { t } = useTranslation();

  useEffect(() => {
    let state = data.theme;
    if (data.theme === 'system') {
      state = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(state);
  }, [data.theme]);

  useEffect(() => {
    const focusFN = () => {
      chrome.storage.sync.get(['apiKey', 'apiBaseUrl', 'namespaceId', 'resourceId'], response => {
        const { apiKey, apiBaseUrl, namespaceId, resourceId } = getOptions(response);
        if (namespaceId && resourceId) {
          refetch();
          return;
        }
        if (!apiKey || !apiBaseUrl) {
          return;
        }
        const baseUrl = apiBaseUrl.endsWith('/') ? apiBaseUrl.slice(0, -1) : apiBaseUrl;
        axios(`${baseUrl}/api/v1/namespaces`, {
          apiKey,
        }).then(namespaces => {
          if (namespaces.length <= 0) {
            refetch();
            return;
          }
          const namespaceId = namespaces[0].id;
          axios(`${baseUrl}/api/v1/namespaces/${namespaceId}/root`, {
            apiKey,
            query: { namespace_id: namespaceId },
          }).then(response => {
            const privateData = response['private'];
            if (!privateData) {
              refetch();
              return;
            }
            const resourceId = privateData.id;
            chrome.storage.sync.set({ namespaceId, resourceId }).finally(refetch);
          });
        });
      });
    };
    window.addEventListener('focus', focusFN);
    return () => {
      window.removeEventListener('focus', focusFN);
    };
  }, [refetch]);

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <Toaster />
      <h1 className="text-2xl font-bold mb-8">{t('setting_title')}</h1>
      <div className="mb-10">
        <h2 className="text-lg text-gray-500 mb-4">{t('setting')}</h2>
        <SettingForm data={data} onChange={onChange} />
      </div>
      <div>
        <h2 className="text-lg text-gray-500 mb-4">{t('common')}</h2>
        <CommonForm data={data} onChange={onChange} />
      </div>
    </div>
  );
}

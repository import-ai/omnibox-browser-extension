import { useEffect } from 'react';
import { Toaster } from 'sonner';
import CommonForm from './common-form';
import SettingForm from './setting-form';
import { useOption } from '@extension/shared';
import { useTranslation } from 'react-i18next';

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
    window.addEventListener('focus', refetch);
    return () => {
      window.removeEventListener('focus', refetch);
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

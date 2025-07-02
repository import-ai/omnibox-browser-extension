import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { t } from '@extension/i18n';
import CommonForm from './common-form';
import SettingForm from './setting-form';
import { useOption } from '@extension/shared';

export default function Page() {
  const { data, onChange } = useOption();

  useEffect(() => {
    let state = data.theme;
    if (data.theme === 'system') {
      state = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(state);
  }, [data.theme]);

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

import { Toaster } from 'sonner';
import { t } from '@extension/i18n';
import CommonForm from './common-form';
import SettingForm from './setting-form';
import { useOption } from '@extension/shared';

export default function Page() {
  const { data, onChange } = useOption();

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <Toaster />
      <h1 className="text-2xl font-bold mb-8">{t('setting_title')}</h1>
      <div className="mb-10">
        <h2 className="text-lg text-gray-500 mb-4">配置设置</h2>
        <SettingForm data={data} onChange={onChange} />
      </div>
      <div>
        <h2 className="text-lg text-gray-500 mb-4">通用设置</h2>
        <CommonForm data={data} onChange={onChange} />
      </div>
    </div>
  );
}

import { Toaster } from 'sonner';
import { t } from '@extension/i18n';
import CommonForm from './common-form';
import SettingForm from './setting-form';

export default function Page() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      <Toaster />
      <h1 className="text-2xl font-bold mb-8">{t('setting_title')}</h1>
      <div className="mb-10">
        <h2 className="text-lg text-gray-500 mb-4">配置设置</h2>
        <SettingForm />
      </div>
      <div>
        <h2 className="text-lg text-gray-500 mb-4">通用设置</h2>
        <CommonForm />
      </div>
    </div>
  );
}

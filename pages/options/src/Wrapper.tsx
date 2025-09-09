import { Toaster } from 'sonner';
import { Header } from './header';
import { useTranslation } from 'react-i18next';

interface IProps {
  children: React.ReactNode;
}

export function Wrapper(props: IProps) {
  const { children } = props;
  const { t } = useTranslation();

  return (
    <div className="bg-[#F3F3F3] min-h-dvh">
      <Toaster />
      <Header />
      <div className="max-w-[628px] mx-auto py-1">
        <h2 className="text-[28px] font-[500] text-[#171717] mt-[37px] mb-[37px]">{t('setting_title')}</h2>
        {children}
      </div>
    </div>
  );
}

import { Toaster } from 'sonner';
import { Header } from './header';
import { useTranslation } from 'react-i18next';

interface IProps {
  baseUrl: string;
  refetch: () => void;
  namespaceId: string;
  children: React.ReactNode;
}

export function Wrapper(props: IProps) {
  const { baseUrl, refetch, children, namespaceId } = props;
  const { t } = useTranslation();

  return (
    <div className="bg-[#F3F3F3] dark:bg-gray-900 min-h-dvh">
      <Toaster />
      <Header baseUrl={baseUrl} refetch={refetch} namespaceId={namespaceId} />
      <div className="max-w-[628px] mx-auto py-1">
        <h2 className="text-[28px] font-[500] text-[#171717] dark:text-gray-100 mt-[37px] mb-[37px]">
          {t('setting_title')}
        </h2>
        {children}
      </div>
    </div>
  );
}

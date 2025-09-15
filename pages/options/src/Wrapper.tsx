import { Toaster } from 'sonner';
import { Header } from './header';
import { Button } from '@extension/ui';
import { useUser } from '@src/hooks/useUser';
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
  const { user } = useUser({ baseUrl });
  const handleLogin = () => {
    chrome.tabs.create({
      url: `${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}/user/login?from=extension`,
    });
  };

  if (!user.id) {
    return (
      <div className="flex flex-col bg-[#F3F3F3] dark:bg-gray-900 min-h-dvh">
        <Toaster />
        <Header profile={false} baseUrl={baseUrl} refetch={refetch} namespaceId={namespaceId} />
        <div className="flex-1 max-w-[628px] mx-auto py-1 flex items-center justify-center">
          <Button variant="default" onClick={handleLogin} className="w-[256px] h-[38px] bg-[#171717] rounded-[8px]">
            {t('login_now')}
          </Button>
        </div>
      </div>
    );
  }

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

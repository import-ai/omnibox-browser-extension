import { Toaster } from 'sonner';
import { Header } from './header';
import { Advance } from './advance';
import { Button } from '@extension/ui';
import { useUser } from '@src/hooks/useUser';
import { useTranslation } from 'react-i18next';
import type { Storage } from '@extension/shared';

interface IProps {
  baseUrl: string;
  data: Storage;
  loading: boolean;
  refetch: () => void;
  namespaceId: string;
  children: React.ReactNode;
  onChange: (val: unknown, key?: string) => void;
}

export function Wrapper(props: IProps) {
  const { data, loading, baseUrl, refetch, onChange, children, namespaceId } = props;
  const { t } = useTranslation();
  const { user, refetch: userRefetch } = useUser({ baseUrl });
  const handleLogin = () => {
    chrome.tabs.create({
      url: `${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}/user/login?from=extension`,
    });
  };

  if (!user.id) {
    return (
      <div className="flex flex-col bg-[#F3F3F3] dark:bg-[#1f1f1f] min-h-dvh">
        <Toaster />
        <Header profile={false} user={user} baseUrl={baseUrl} refetch={refetch} namespaceId={namespaceId} />
        <div className="max-w-[628px] w-full mx-auto mt-[192px]">
          <div className="mb-[36px] bg-white dark:bg-[#262626] rounded-[16px] p-[24px]">
            <Advance loading={loading} data={data} onChange={onChange} refetch={refetch} />
          </div>
          <div className="flex-1 flex items-center justify-center">
            <Button variant="default" onClick={handleLogin} className="w-[256px] h-[38px] bg-[#171717] rounded-[8px]">
              {t('login_now')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F3F3F3] dark:bg-[#1f1f1f] min-h-dvh">
      <Toaster />
      <Header
        user={user}
        baseUrl={baseUrl}
        onChange={onChange}
        refetch={refetch}
        namespaceId={namespaceId}
        userRefetch={userRefetch}
      />
      <div className="max-w-[628px] mx-auto py-1">
        <h2 className="text-[28px] font-[500] text-[#171717] dark:text-gray-100 mt-[37px] mb-[37px]">
          {t('setting_title')}
        </h2>
        {children}
      </div>
    </div>
  );
}

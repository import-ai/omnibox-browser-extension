import { Button } from '@extension/ui';
import { useTranslation } from 'react-i18next';

interface IProps {
  baseUrl: string;
}

export function Auth(props: IProps) {
  const { baseUrl } = props;
  const { t } = useTranslation();
  const handleAuth = () => {
    chrome.runtime.sendMessage({
      action: 'create-tab',
      url: `${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}/user/login?from=extension`,
    });
  };

  return (
    <div>
      <p className="text-sm text-[#585D65] mt-[28px] mb-[24px]">{t('login_required')}</p>
      <Button variant="default" onClick={handleAuth} className="w-full flex items-center rounded-[8px] mt-[20px]">
        {t('login_now')}
      </Button>
    </div>
  );
}

import { Button } from '@extension/ui';
import { useTranslation } from 'react-i18next';

interface IProps {
  resourceId: string;
  namespaceId: string;
  baseUrl: string;
}

export default function Done(props: IProps) {
  const { resourceId, namespaceId, baseUrl } = props;
  const { t } = useTranslation();
  const handleClick = () => {
    chrome.tabs.create({
      url: `${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}/${namespaceId}/${resourceId}`,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2 min-h-60">
      <Button className="max-w-52" onClick={handleClick}>
        {t('open_in_ominibox')}
      </Button>
      <div className="text-muted-foreground opacity-80">{t('enter')}</div>
    </div>
  );
}

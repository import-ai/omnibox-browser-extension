import Wrapper from '@src/Wrapper';
import { Button } from '@extension/ui';
import { useTranslation } from 'react-i18next';

export default function Config() {
  const { t } = useTranslation();
  const handleOption = () => {
    chrome.runtime.openOptionsPage();
  };

  return (
    <Wrapper>
      <Button className="w-full" onClick={handleOption}>
        {t('config_first')}
      </Button>
    </Wrapper>
  );
}

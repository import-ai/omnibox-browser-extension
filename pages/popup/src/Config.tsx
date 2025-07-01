import Wrapper from '@src/Wrapper';
import { t } from '@extension/i18n';
import { Button } from '@extension/ui';

export default function Config() {
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

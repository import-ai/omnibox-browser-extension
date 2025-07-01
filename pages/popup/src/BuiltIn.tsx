import Wrapper from '@src/Wrapper';
import { t } from '@extension/i18n';
import { Button } from '@extension/ui';

export default function BuiltIn() {
  return (
    <Wrapper>
      <Button variant="destructive" className="w-full" disabled>
        {t('alert_built')}
      </Button>
    </Wrapper>
  );
}

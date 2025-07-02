import Wrapper from '@src/Wrapper';
import { Button } from '@extension/ui';
import { useTranslation } from 'react-i18next';

export default function BuiltIn() {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <Button variant="destructive" className="w-full whitespace-normal h-auto" disabled>
        {t('alert_built')}
      </Button>
    </Wrapper>
  );
}

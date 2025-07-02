import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@extension/ui';

interface IProps {
  children: React.ReactNode;
}

export default function Wrapper(props: IProps) {
  const { children } = props;
  const { t } = useTranslation();

  return (
    <Card className="border-none shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl">{t('extensionName')}</CardTitle>
        <CardDescription>{t('extensionDescription')}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

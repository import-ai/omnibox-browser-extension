import { t } from '@extension/i18n';
import { Button } from '@extension/ui';

export default function Done() {
  return (
    <div className="flex flex-col items-center justify-center gap-2 min-h-60">
      <Button className="max-w-52">{t('open_in_ominibox')}</Button>
      <div className="text-muted-foreground opacity-80">{t('enter')}</div>
    </div>
  );
}

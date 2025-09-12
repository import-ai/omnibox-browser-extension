import { Button } from '@extension/ui';
import { useTranslation } from 'react-i18next';
import { useEffect, useCallback } from 'react';

interface IProps {
  choosing: boolean;
  onChoosing: (choosing: boolean) => void;
}

export function Choose(props: IProps) {
  const { onChoosing } = props;
  const { t } = useTranslation();
  const cancelChoose = useCallback(() => {
    onChoosing(false);
  }, [onChoosing]);

  useEffect(() => {
    function handleESC(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        cancelChoose();
      }
    }
    document.addEventListener('keydown', handleESC);
    return () => {
      document.removeEventListener('keydown', handleESC);
    };
  }, [cancelChoose]);

  return (
    <div className="flex gap-2 text-sm font-medium justify-between items-center px-4 py-3">
      <span>{t('choose_start')}</span>
      <Button size="sm" className="h-6" onClick={cancelChoose}>
        {t('choose_cancel')}
      </Button>
    </div>
  );
}

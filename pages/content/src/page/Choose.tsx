import useApp from './hooks/useApp';
import { Button } from '@extension/ui';
import { useTranslation } from 'react-i18next';
import { useState, useEffect, useCallback } from 'react';

export default function Choose() {
  const { app } = useApp();
  const { t } = useTranslation();
  const [open, onOpen] = useState(false);
  const cancelChoose = useCallback(() => {
    onOpen(false);
    app.fire('cancel-choose');
  }, [app]);

  useEffect(() => {
    return app.on('choose', onOpen);
  }, [app]);

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

  if (!open) {
    return null;
  }

  return (
    <div className="flex text-sm font-medium justify-between items-center px-4 py-3">
      <span>{t('choose_start')}</span>
      <Button size="sm" className="h-6" onClick={cancelChoose}>
        {t('choose_cancel')}
      </Button>
    </div>
  );
}

import useApp from './hooks/useApp';
import zIndex from '../utils/zindex';
import DraggableBox from './Draggable';
import { Button } from '@extension/ui';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function Choose() {
  const { app } = useApp();
  const { t } = useTranslation();
  const [open, onOpen] = useState(false);
  const cancelChoose = () => {
    onOpen(false);
    app.fire('cancel-choose');
  };

  useEffect(() => {
    return app.on('choose', onOpen);
  }, [app]);

  if (!open) {
    return null;
  }

  return (
    <DraggableBox zIndex={zIndex()}>
      <span>{t('choose_start')}</span>
      <Button size="sm" className="h-6" onClick={cancelChoose}>
        {t('choose_cancel')}
      </Button>
    </DraggableBox>
  );
}

import useApp from './hooks/useApp';
import { Button } from '@extension/ui';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { Storage } from '@extension/shared';
import { Loader2, AlertCircleIcon } from 'lucide-react';

type Status = '' | 'pending' | 'error' | 'done';

export default function Feedback(props: Storage) {
  const { namespaceId, apiBaseUrl } = props;
  const { app } = useApp();
  const [result, setResult] = useState('');
  const [deadline, setDeadline] = useState(3);
  const [status, setStatus] = useState<Status>('');
  const { t } = useTranslation();
  const handleClick = () => {
    chrome.runtime.sendMessage({
      action: 'create-tab',
      url: `${apiBaseUrl.endsWith('/') ? apiBaseUrl.slice(0, -1) : apiBaseUrl}/${namespaceId}/${result}`,
    });
  };

  useEffect(() => {
    if (status !== 'done') {
      return;
    }
    const timer = setInterval(() => {
      if (deadline <= 1) {
        clearInterval(timer);
        setStatus('');
        setResult('');
        setDeadline(3);
        return;
      }
      setDeadline(deadline - 1);
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [status, deadline]);

  useEffect(() => {
    const hooks: Array<() => void> = [];
    hooks.push(app.on('status', setStatus));
    hooks.push(app.on('result', setResult));
    return () => {
      hooks.forEach(hook => {
        hook();
      });
    };
  }, [app]);

  if (!status) {
    return null;
  }

  if (status === 'pending') {
    return (
      <div className="flex text-sm font-medium gap-2 items-center px-4 py-3">
        <Loader2 className="animate-spin" />
        <span>{t('pending')}</span>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex text-sm gap-2 items-center px-4 py-3 text-red-600">
        <AlertCircleIcon className="size-4" />
        <span>{result}</span>
      </div>
    );
  }

  return (
    <div className="text-sm font-medium px-4 py-3">
      <div className="flex gap-2 items-center justify-between">
        <span>{t('save_success')}</span>
        <Button size="sm" className="h-6" onClick={handleClick}>
          {t('view')}
        </Button>
      </div>
      <div className="text-muted-foreground opacity-90 text-left">
        {t('close_after_three_seconds', { seconds: deadline })}
      </div>
    </div>
  );
}

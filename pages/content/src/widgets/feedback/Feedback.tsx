import { Button } from '@extension/ui';
import { useState, useEffect } from 'react';
import { SuccessIcon } from '@src/icon/success';
import { useTranslation } from 'react-i18next';
import type { Storage } from '@extension/shared';
import { Loader2, AlertCircleIcon } from 'lucide-react';
import type { Status } from '@src/provider/types';

interface IProps {
  status: Status;
  result: string;
  data: Storage;
  onStatus: (status: Status) => void;
  onResult: (result: string) => void;
}

export function Feedback(props: IProps) {
  const { data, status, result, onStatus, onResult } = props;
  const [deadline, setDeadline] = useState(3);
  const { t } = useTranslation();
  const handleClick = () => {
    chrome.runtime.sendMessage({
      action: 'create-tab',
      url: `${data.apiBaseUrl.endsWith('/') ? data.apiBaseUrl.slice(0, -1) : data.apiBaseUrl}/${data.namespaceId}/${result}`,
    });
  };

  useEffect(() => {
    if (status !== 'done' || !data.audioEnabled) {
      return;
    }
    const audio = new Audio();
    audio.src =
      'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEcBjiR1/LNeSsFJHfH8N2QQAoUXrTp66hVFApGn+DyvmE=';
    audio.play();
  }, [status, data.audioEnabled]);

  useEffect(() => {
    if (status !== 'done') {
      return;
    }
    const timer = setInterval(() => {
      if (deadline <= 1) {
        clearInterval(timer);
        onStatus('');
        onResult('');
        setDeadline(3);
        return;
      }
      setDeadline(deadline - 1);
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [status, deadline, onStatus, onResult]);

  if (status === 'pending') {
    return (
      <div className="flex text-sm font-medium gap-2 items-center px-[16px] py-[8px]">
        <Loader2 className="animate-spin" />
        <span>{t('pending')}</span>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex text-sm gap-2 items-center px-[16px] py-[8px] text-red-600">
        <AlertCircleIcon className="size-4" />
        <span>{result}</span>
      </div>
    );
  }

  return (
    <div className="text-sm font-medium flex gap-2 items-center justify-between px-[16px] py-[8px]">
      <div className="flex items-center gap-[8px]">
        <SuccessIcon />
        <span>{t('save_success_message')}</span>
      </div>
      <Button
        size="sm"
        className="h-6 rounded-[100px] dark:border dark:text-[#c0c0c0] dark:border-[#454545] dark:bg-[#F2F3F5] dark:bg-opacity-10"
        onClick={handleClick}>
        {t('view_button')}
      </Button>
    </div>
  );
}

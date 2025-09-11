import { Button } from '@extension/ui';
import { useState, useEffect } from 'react';
import { SuccessIcon } from '@src/icon/success';
import { useTranslation } from 'react-i18next';
import { getOptions } from '@extension/shared';
import { Loader2, AlertCircleIcon } from 'lucide-react';

type Status = '' | 'pending' | 'error' | 'done';

interface NotificationProps {
  status?: Status;
  result?: string;
}

export default function Notification({ status: propStatus, result: propResult }: NotificationProps) {
  const [result, setResult] = useState(propResult || '');
  const [deadline, setDeadline] = useState(3);
  const [status, setStatus] = useState<Status>(propStatus || '');
  const { t } = useTranslation();

  // Update internal state when props change
  useEffect(() => {
    if (propStatus !== undefined) {
      setStatus(propStatus);
      setDeadline(3);
    }
    if (propResult !== undefined) {
      setResult(propResult);
    }
  }, [propStatus, propResult]);
  const handleClick = () => {
    chrome.storage.sync.get(['apiBaseUrl', 'namespaceId'], response => {
      const { apiBaseUrl, namespaceId } = getOptions(response);
      chrome.runtime.sendMessage({
        action: 'create-tab',
        url: `${apiBaseUrl.endsWith('/') ? apiBaseUrl.slice(0, -1) : apiBaseUrl}/${namespaceId}/${result}`,
      });
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

  if (!status) {
    return null;
  }

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
        <span>已保存到该文件夹</span>
      </div>
      <Button size="sm" className="h-6 rounded-[100px]" onClick={handleClick}>
        查看
      </Button>
    </div>
  );
}

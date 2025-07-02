import Done from './Done';
import Config from './Config';
import Choose from './Choose';
import Collect from './Collect';
import BuiltIn from './BuiltIn';
import Setting from './Setting';
import { t } from '@extension/i18n';
import { toast, Toaster } from 'sonner';
import { useState, useEffect } from 'react';
import { useOption } from '@extension/shared';
import { cn } from '@extension/ui/lib/utils';
import extPage from '@extension/shared/lib/utils/ext-page';
import { Separator, Resource, ChooseResource, Namespace, ChooseNamespace } from '@extension/ui';

export default function Page() {
  const { data, onChange } = useOption();
  const [tabId, onTabId] = useState(-1);
  const [done, setDone] = useState(false);
  const [choosing, setChoosing] = useState(false);
  const [collecting, setCollecting] = useState(false);
  const [chooseResource, onChooseResource] = useState(false);
  const [chooseNamespace, onChooseNamespace] = useState(false);
  const handleChoose = () => {
    if (tabId <= 0) {
      return;
    }
    if (choosing) {
      chrome.tabs.sendMessage(tabId, { action: 'cancel-choose' }, () => {
        setChoosing(false);
      });
      return;
    }
    setChoosing(true);
    chrome.tabs.sendMessage(tabId, { action: 'choose', option: data }, response => {
      setChoosing(false);
      if (response && response.error) {
        toast.error(response.error, { position: 'top-center' });
      } else {
        setDone(true);
      }
    });
    toast.success(t('choose_start'), { position: 'top-center' });
    setTimeout(() => {
      window.close();
    }, 1000);
  };
  const handleCollect = () => {
    if (tabId <= 0) {
      return;
    }
    setCollecting(true);
    chrome.tabs.sendMessage(tabId, { action: 'collect', option: data }, response => {
      setCollecting(false);
      if (response && response.error) {
        toast.error(response.error, { position: 'top-center' });
      } else {
        setDone(true);
      }
      onTabId(-1);
    });
  };
  const handleNamespace = () => {
    onChooseNamespace(true);
  };
  const cancelNamespace = () => {
    onChooseNamespace(false);
  };
  const handleResource = () => {
    onChooseResource(true);
  };
  const cancelResource = () => {
    onChooseResource(false);
  };

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      if (!tabs[0].id) {
        return;
      }
      if (extPage(tabs[0].url)) {
        onTabId(0);
        return;
      }
      onTabId(tabs[0].id);
      chrome.runtime.sendMessage(
        {
          action: 'status',
        },
        response => {
          if (!response.data) {
            return;
          }
          if (response.data === 'collect') {
            setCollecting(true);
          } else {
            setChoosing(true);
          }
        },
      );
    });
  }, []);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const messageFN = (request: any, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => {
      if (request.action === 'sync-status') {
        if (request.type === 'collect') {
          setCollecting(false);
          if (request.error) {
            toast.error(request.error, { position: 'top-center' });
          } else {
            setDone(true);
          }
          onTabId(-1);
        } else if (request.type === 'choose') {
          setChoosing(false);
          if (request.error) {
            toast.error(request.error, { position: 'top-center' });
          } else {
            setDone(true);
          }
        }
        sendResponse({});
      }
      return true;
    };
    chrome.runtime.onMessage.addListener(messageFN);
    return () => {
      chrome.runtime.onMessage.removeListener(messageFN);
    };
  }, []);

  useEffect(() => {
    let state = data.theme;
    if (data.theme === 'system') {
      state = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(state);
  }, [data.theme]);

  if (!data.apiKey) {
    return <Config />;
  }

  if (tabId === 0) {
    return <BuiltIn />;
  }

  return (
    <div className="max-w-md">
      <Toaster />
      {done ? (
        <Done />
      ) : (
        <>
          {chooseNamespace && (
            <ChooseNamespace
              onChange={onChange}
              apiKey={data.apiKey}
              baseUrl={data.apiBaseUrl}
              onCancel={cancelNamespace}
              namespaceId={data.namespaceId}
            />
          )}
          {chooseResource && (
            <ChooseResource
              onChange={onChange}
              apiKey={data.apiKey}
              onCancel={cancelResource}
              baseUrl={data.apiBaseUrl}
              resourceId={data.resourceId}
              namespaceId={data.namespaceId}
            />
          )}
          <div className={cn('flex flex-col', { hidden: chooseNamespace || chooseResource })}>
            <Collect disabled={tabId < 0} loading={collecting} onClick={handleCollect} />
            <Separator />
            <Choose disabled={tabId < 0} loading={choosing} onClick={handleChoose} />
            <Separator />
            <Setting />
            <Separator />
            <Namespace
              label={t('space')}
              apiKey={data.apiKey}
              onClick={handleNamespace}
              baseUrl={data.apiBaseUrl}
              namespaceId={data.namespaceId}
            />
            <Resource
              label={t('collect_to')}
              apiKey={data.apiKey}
              onClick={handleResource}
              baseUrl={data.apiBaseUrl}
              resourceId={data.resourceId}
              namespaceId={data.namespaceId}
            />
          </div>
        </>
      )}
    </div>
  );
}

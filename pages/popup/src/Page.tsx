import Done from './Done';
import Header from './Header';
import Config from './Config';
import Choose from './Choose';
import Collect from './Collect';
import BuiltIn from './BuiltIn';
import { toast, Toaster } from 'sonner';
import { useState, useEffect } from 'react';
import { cn } from '@extension/ui/lib/utils';
import { useOption } from '@extension/shared';
import { useTranslation } from 'react-i18next';
import extPage from '@extension/shared/lib/utils/ext-page';
import { Separator, Resource, ChooseResource, Namespace, ChooseNamespace } from '@extension/ui';

export default function Page() {
  const { t, i18n } = useTranslation();
  const { data, refetch, onChange } = useOption();
  const [tabId, onTabId] = useState(-1);
  const [doneUrl, setDoneUrl] = useState('');
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
        setDoneUrl(response.data.resource_id);
      }
    });
    window.close();
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
        setDoneUrl(response.data.resource_id);
      }
      onTabId(-1);
    });
    window.close();
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
            setDoneUrl(request.data.resource_id);
          }
          onTabId(-1);
        } else if (request.type === 'choose') {
          setChoosing(false);
          if (request.error) {
            toast.error(request.error, { position: 'top-center' });
          } else {
            setDoneUrl(request.data.resource_id);
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

  useEffect(() => {
    if (data.language !== i18n.language) {
      i18n.changeLanguage(data.language);
    }
  }, [i18n, data.language]);

  if (!data.namespaceId) {
    return <Config />;
  }

  if (tabId === 0) {
    return <BuiltIn />;
  }

  return (
    <div className="max-w-md">
      <Toaster />
      {doneUrl ? (
        <Done resourceId={doneUrl} namespaceId={data.namespaceId} baseUrl={data.apiBaseUrl} />
      ) : (
        <>
          {chooseNamespace && (
            <ChooseNamespace
              backText={t('back')}
              onChange={onChange}
              baseUrl={data.apiBaseUrl}
              onCancel={cancelNamespace}
              namespaceId={data.namespaceId}
              placeholder={t('search_for_namespace')}
            />
          )}
          {chooseResource && (
            <ChooseResource
              backText={t('back')}
              onChange={onChange}
              onCancel={cancelResource}
              baseUrl={data.apiBaseUrl}
              resourceId={data.resourceId}
              namespaceId={data.namespaceId}
              untitled={t('untitled')}
              privateText={t('private')}
              teamspaceText={t('teamspace')}
              placeholder={t('search_for_resource')}
            />
          )}
          <div className={cn('flex flex-col', { hidden: chooseNamespace || chooseResource })}>
            <Header refetch={refetch} baseUrl={data.apiBaseUrl} />
            <Separator />
            <Collect disabled={tabId < 0} loading={collecting} onClick={handleCollect} />
            <Separator />
            <Choose disabled={tabId < 0} loading={choosing} onClick={handleChoose} />
            <Separator />
            <Namespace
              label={t('space')}
              onClick={handleNamespace}
              baseUrl={data.apiBaseUrl}
              namespaceId={data.namespaceId}
            />
            <Resource
              untitled={t('untitled')}
              label={t('collect_to')}
              onClick={handleResource}
              baseUrl={data.apiBaseUrl}
              privateText={t('private')}
              teamspaceText={t('teamspace')}
              resourceId={data.resourceId}
              namespaceId={data.namespaceId}
            />
          </div>
        </>
      )}
    </div>
  );
}

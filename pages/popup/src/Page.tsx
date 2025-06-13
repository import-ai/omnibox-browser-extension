import Wrapper from '@src/Wrapper';
import { t } from '@extension/i18n';
import { Button } from '@extension/ui';
import { toast, Toaster } from 'sonner';
import { useState, useEffect } from 'react';
import { useOption } from '@extension/shared';
import extPage from '@extension/shared/lib/utils/ext-page';
import { X, LoaderCircle, ChevronRight, File, Link, Settings, LassoSelect } from 'lucide-react';

export default function Page() {
  const { value, refetch } = useOption();
  const [tabId, onTabId] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [choosing, setChoosing] = useState(false);
  const handleOption = () => {
    chrome.runtime.openOptionsPage();
  };
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
    chrome.tabs.sendMessage(tabId, { action: 'choose', option: value }, response => {
      setChoosing(false);
      if (response && response.error) {
        toast.error(response.error, { position: 'top-center' });
      } else {
        toast.success(t('collect_done'), { position: 'top-center' });
      }
    });
    toast.success(t('choose_start'), { position: 'top-center' });
  };
  const handleCollect = () => {
    if (tabId <= 0) {
      return;
    }
    setLoading(true);
    chrome.tabs.sendMessage(tabId, { action: 'save', option: value }, response => {
      setLoading(false);
      if (response && response.error) {
        toast.error(response.error, { position: 'top-center' });
        refetch();
      } else {
        toast.success(t('collect_done'), { position: 'top-center' });
      }
      onTabId(-1);
    });
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
    });
  }, []);

  if (!value.apiBaseUrl) {
    return (
      <Wrapper>
        <Button className="w-full" onClick={handleOption}>
          {t('config_first')}
        </Button>
      </Wrapper>
    );
  }

  if (tabId === 0) {
    return (
      <Wrapper>
        <Button variant="destructive" className="w-full" disabled>
          {t('alert_built')}
        </Button>
      </Wrapper>
    );
  }

  return (
    <div className="max-w-md">
      <Toaster />
      <div className="divide-y">
        <Button
          variant="ghost"
          disabled={tabId < 0}
          onClick={handleCollect}
          className="w-full flex items-center justify-between rounded-none font-normal h-12">
          <div className="flex items-center space-x-3">
            <Link className="size-6" />
            <span>{t('collect_submit')}</span>
          </div>
          {loading ? (
            <LoaderCircle className="transition-transform animate-spin" />
          ) : (
            <ChevronRight className="size-5" />
            // <div className="bg-gray-100 px-3 py-1 rounded-md">
            //   <span className="text-gray-700">0</span>
            // </div>
          )}
        </Button>
        <Button
          disabled
          variant="ghost"
          className="w-full flex items-center justify-between rounded-none font-normal h-12">
          <div className="flex items-center space-x-3">
            <File className="size-6" />
            <span>{t('collect_article')}</span>
          </div>
          <ChevronRight className="size-5" />
          {/* <div className="bg-gray-100 px-3 py-1 rounded-md">
            <span className="opacity-80">1</span>
          </div> */}
        </Button>
        <Button
          variant="ghost"
          disabled={tabId < 0}
          onClick={handleChoose}
          className="w-full flex items-center justify-between rounded-none font-normal h-12">
          {choosing ? (
            <div className="flex items-center space-x-3">
              <X className="size-6" />
              <span>{t('choose_cancel')}</span>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <LassoSelect className="size-6" />
              <span>{t('choose_area')}</span>
            </div>
          )}
          <ChevronRight className="size-5" />
          {/* <div className="bg-gray-100 px-3 py-1 rounded-md">
            <span className="opacity-80">2</span>
          </div> */}
        </Button>
        <Button
          variant="ghost"
          onClick={handleOption}
          className="w-full flex items-center justify-between rounded-none font-normal h-12">
          <div className="flex items-center space-x-3">
            <Settings className="size-6" />
            <span>{t('setting_title')}</span>
          </div>
          <ChevronRight className="size-5" />
        </Button>
      </div>
    </div>
  );
}

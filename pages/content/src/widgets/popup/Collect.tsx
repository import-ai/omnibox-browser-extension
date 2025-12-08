import { useState } from 'react';
import { Button } from '@extension/ui';
import { BoxIcon } from '@src/icon/box';
import type { Storage } from '@extension/shared';
import { useAction } from '@src/provider/useAction';
import { useTranslation } from 'react-i18next';

interface IProps {
  data: Storage;
}

export default function Collect(props: IProps) {
  const { data } = props;
  const [loading, onLoading] = useState(false);
  const { onResult, onStatus, onPopup } = useAction();
  const { t } = useTranslation();
  const handleCollect = () => {
    onLoading(true);
    const { apiBaseUrl, resourceId, namespaceId } = data;
    chrome.runtime.sendMessage(
      {
        resourceId,
        namespaceId,
        action: 'collect',
        baseUrl: apiBaseUrl,
        pageUrl: document.URL,
        pageTitle: document.title,
        data: document.documentElement.outerHTML,
      },
      response => {
        onLoading(false);
        if (response && response.error) {
          onStatus('error');
          onResult(response.error);
        } else {
          onStatus('done');
          onResult(response.data.resource_id);
        }
        onPopup(false);
      },
    );
    chrome.runtime.sendMessage({
      action: 'track',
      name: 'save_to_omnibox_in_extension',
    });
  };

  return (
    <Button
      variant="default"
      loading={loading}
      onClick={handleCollect}
      className="w-full flex h-[38px] items-center rounded-[8px] mt-[20px] dark:text-white dark:bg-[#404040]">
      {!loading && <BoxIcon />}
      <span>{t(loading ? 'saving' : 'save_to_omnibox')}</span>
    </Button>
  );
}

import { useState } from 'react';
import { toast } from 'sonner';
import { useOption } from '@extension/shared';
import Collect from './Collect';
import { Save } from './save';
import { Section } from './Section';
import { SectionText } from './SelectionText';

export function MainContent() {
  const { data } = useOption();
  const [collecting, setCollecting] = useState(false);

  const handleCollect = () => {
    setCollecting(true);
    chrome.runtime.sendMessage(
      {
        resourceId: data.resourceId,
        namespaceId: data.namespaceId,
        type: 'collect',
        action: 'collect',
        baseUrl: data.apiBaseUrl,
        pageUrl: document.URL,
        pageTitle: document.title,
        data: document.documentElement.outerHTML,
      },
      response => {
        setCollecting(false);
        if (response && response.error) {
          toast.error(response.error, { position: 'top-center' });
        } else {
          // setDoneUrl(response.data.resource_id);
        }
      },
    );
  };

  return (
    <>
      <Collect loading={collecting} onClick={handleCollect} />
      <Save data={data} />
      <Section />
      <SectionText />
    </>
  );
}

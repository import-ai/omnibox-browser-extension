import Header from './Header';
import { Auth } from './Auth';
import { Save } from './save';
import Collect from './Collect';
import { useEffect } from 'react';
import { Wrapper } from './Wrapper';
import { Section } from './Section';
import type { Response } from '@extension/shared';
import { track, useUser } from '@extension/shared';
import { useAction } from '@src/provider/useAction';

export function PopupContainer(props: Response) {
  const { data, loading, onChange } = props;
  const { popup } = useAction();
  const { user } = useUser({ baseUrl: loading ? '' : data.apiBaseUrl });

  useEffect(() => {
    track('open_chrome_popup', {
      once: true,
      section: 'ext_popup',
    });
  }, []);

  useEffect(() => {
    if (!user.id || !data.apiBaseUrl || data.namespaceId || data.resourceId) {
      return;
    }
    const baseUrl = data.apiBaseUrl.endsWith('/') ? data.apiBaseUrl.slice(0, -1) : data.apiBaseUrl;
    chrome.runtime.sendMessage(
      {
        action: 'fetch',
        url: `${baseUrl}/api/v1/namespaces`,
      },
      response => {
        if (!response.data) {
          return;
        }
        if (response.data.length <= 0) {
          return;
        }
        const namespaceId = response.data[0].id;
        chrome.runtime.sendMessage(
          {
            action: 'fetch',
            query: { namespace_id: namespaceId },
            url: `${baseUrl}/api/v1/namespaces/${namespaceId}/root`,
          },
          root => {
            if (!root.data) {
              return;
            }
            const privateData = root.data['private'];
            if (!privateData) {
              return;
            }
            const resourceId = privateData.id;
            onChange({
              namespaceId,
              resourceId,
            });
          },
        );
      },
    );
  }, [data.apiBaseUrl, data.namespaceId, data.resourceId, user.id, onChange]);

  if (!popup) {
    return null;
  }

  return (
    <Wrapper>
      <Header />
      {user.id ? (
        <>
          <Collect data={data} />
          <Save data={data} loading={loading} onChange={onChange} />
          <Section data={data} onChange={onChange} />
        </>
      ) : (
        <Auth baseUrl={data.apiBaseUrl} />
      )}
    </Wrapper>
  );
}

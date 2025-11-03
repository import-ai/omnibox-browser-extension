import Header from './Header';
import { Auth } from './Auth';
import { Save } from './save';
import Collect from './Collect';
import { useEffect } from 'react';
import { Wrapper } from './Wrapper';
import { Section } from './Section';
import { useUser } from '@src/hooks/useUser';
import type { Response } from '@extension/shared';
import { useAction } from '@src/provider/useAction';

export function PopupContainer(props: Response) {
  const { data, loading, onChange } = props;
  const { popup, onPopup } = useAction();
  const { user } = useUser({ baseUrl: loading ? '' : data.apiBaseUrl });

  useEffect(() => {
    if (loading || !user.id || !data.apiBaseUrl) {
      return;
    }
    const baseUrl = data.apiBaseUrl.endsWith('/') ? data.apiBaseUrl.slice(0, -1) : data.apiBaseUrl;
    if (data.namespaceId && data.resourceId) {
      chrome.runtime.sendMessage(
        {
          action: 'fetch',
          url: `${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}/api/v1/namespaces/${data.namespaceId}/root`,
        },
        response => {
          let match = false;
          if (response.data) {
            const rootIds = Object.keys(response.data).map(spaceType => response.data[spaceType].id);
            if (rootIds.includes(data.resourceId)) {
              match = true;
            }
          }
          if (match) {
            return;
          }
          chrome.runtime.sendMessage(
            {
              action: 'fetch',
              url: `${baseUrl}/api/v1/namespaces/${data.namespaceId}/resources/${data.resourceId}`,
            },
            response => {
              if (!response.error) {
                return;
              }
              chrome.runtime.sendMessage(
                {
                  action: 'fetch',
                  url: `${baseUrl}/api/v1/namespaces/${data.namespaceId}/root`,
                },
                root => {
                  if (!root.data || !root.data.private) {
                    return;
                  }
                  onChange(root.data.private.id, 'resourceId');
                },
              );
            },
          );
        },
      );
      return;
    }
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
            const uncategorizedFolder = privateData.children?.find(
              (child: { id: string; name: string }) => child.name === 'Uncategorized' || child.name === '未分类',
            );
            onChange({
              namespaceId,
              resourceId: uncategorizedFolder ? uncategorizedFolder.id : privateData.id,
            });
          },
        );
      },
    );
  }, [loading, data.apiBaseUrl, data.namespaceId, data.resourceId, user.id, onChange]);

  if (!popup) {
    return null;
  }

  return (
    <Wrapper onPopup={onPopup}>
      <Header baseUrl={data.apiBaseUrl} namespaceId={data.namespaceId} />
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

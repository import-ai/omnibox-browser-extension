import Header from './Header';
import { Auth } from './Auth';
import { Save } from './save';
import Collect from './Collect';
import { useEffect } from 'react';
import { Wrapper } from './Wrapper';
import { Section } from './Section';
import { Loader2 } from 'lucide-react';
import { useUser } from '@src/hooks/useUser';
import type { Response } from '@extension/shared';

interface IProps extends Response {
  onPopup: (popup: boolean | ((prev: boolean) => boolean)) => void;
}

export function Page(props: IProps) {
  const { onPopup, data, loading, onChange } = props;
  const { user, loading: userLoading } = useUser({ baseUrl: loading ? '' : data.apiBaseUrl });

  useEffect(() => {
    if (loading || !user.id || !data.apiBaseUrl) {
      return;
    }
    const baseUrl = data.apiBaseUrl.endsWith('/') ? data.apiBaseUrl.slice(0, -1) : data.apiBaseUrl;
    if (data.namespaceId && data.resourceId) {
      chrome.runtime.sendMessage(
        {
          action: 'fetch',
          url: `${baseUrl}/api/v1/namespaces/${data.namespaceId}/root`,
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
            onChange({
              namespaceId,
              resourceId: privateData.id,
            });
          },
        );
      },
    );
  }, [loading, data.apiBaseUrl, data.namespaceId, data.resourceId, user.id, onChange]);

  if (userLoading) {
    return (
      <Wrapper onPopup={onPopup}>
        <div className="flex items-center justify-center opacity-60">
          <Loader2 className="animate-spin" />
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper onPopup={onPopup}>
      <Header baseUrl={data.apiBaseUrl} namespaceId={data.namespaceId} isLoggedIn={!!user.id} />
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

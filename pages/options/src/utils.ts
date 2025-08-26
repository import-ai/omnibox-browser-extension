import axios from '@extension/shared/lib/utils/axios';
import { getOptions } from '@extension/shared/lib/utils/options';

export function isValidStrictHttpRootDomain(url: string) {
  try {
    const parsedUrl = new URL(url);
    // 检查协议是否是 HTTP/HTTPS
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return false;
    }
    // 验证根域名
    const rootDomainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;
    return rootDomainRegex.test(parsedUrl.hostname);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    return false;
  }
}

export function initResources(callback?: () => void) {
  chrome.storage.sync.get(['apiKey', 'apiBaseUrl', 'namespaceId', 'resourceId'], response => {
    const { apiBaseUrl, namespaceId, resourceId } = getOptions(response);
    if (namespaceId && resourceId) {
      if (callback) {
        callback();
      }
      return;
    }
    if (!apiBaseUrl) {
      return;
    }
    const baseUrl = apiBaseUrl.endsWith('/') ? apiBaseUrl.slice(0, -1) : apiBaseUrl;
    axios(`${baseUrl}/api/v1/namespaces`).then(namespaces => {
      if (namespaces.length <= 0) {
        if (callback) {
          callback();
        }
        return;
      }
      const namespaceId = namespaces[0].id;
      axios(`${baseUrl}/api/v1/namespaces/${namespaceId}/root`, {
        query: { namespace_id: namespaceId },
      }).then(response => {
        const privateData = response['private'];
        if (!privateData) {
          if (callback) {
            callback();
          }
          return;
        }
        const resourceId = privateData.id;
        chrome.storage.sync.set({ namespaceId, resourceId }).finally(callback);
      });
    });
  });
}

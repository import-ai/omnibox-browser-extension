import { t } from '@extension/i18n';

export default function axios(
  url: string,
  opts: {
    apiKey: string;
    format?: 'json' | 'text' | 'blob';
    query?: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [index: string]: any;
    };
    data?: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [index: string]: any;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [index: string]: any;
  },
) {
  const params = opts || {};
  params.url = url;
  const data = params.data;
  if (data) {
    delete params.data;
    if (Object.keys(data).length > 0) {
      params.body = JSON.stringify(data);
    }
    if (!params.method) {
      params.method = 'POST';
    }
  }
  const query = params.query;
  if (query) {
    delete params.query;
    if (Object.keys(query).length > 0) {
      const queryVal: Array<string> = [];
      Object.keys(query).forEach(key => {
        queryVal.push(`${key}=${encodeURIComponent(query[key])}`);
      });
      params.url = `${params.url}${params.url.indexOf('?') >= 0 ? '&' : '?'}${queryVal.join('&')}`;
    }
    if (!params.method) {
      params.method = 'GET';
    }
  }
  if (!params.headers) {
    params.headers = {
      'Content-Type': 'application/json',
    };
  }
  params.headers.Authorization = `Bearer ${params.apiKey}`;
  return fetch(params.url, {
    body: params.body,
    method: params.method,
    headers: params.headers,
  }).then(response => {
    if (!response.ok) {
      if (response.status === 401) {
        chrome.storage.sync.remove(['apiKey', 'namespaceId', 'spaceType']);
      }
      return Promise.reject(new Error(t('http_error', `${response.status}`)));
    } else {
      return response.json();
    }
  });
}

export default function axios(
  url: string,
  opts: {
    apiKey?: string;
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
  if (params.apiKey) {
    params.headers.Authorization = `Bearer ${params.apiKey}`;
  }
  const options: RequestInit = {
    body: params.body,
    redirect: 'manual',
    headers: params.headers,
    method: params.method || 'GET',
  };
  return fetch(params.url, options).then(response => {
    if (!response.ok) {
      if (response.type === 'opaqueredirect') {
        const parsedUrl = new URL(params.url);
        parsedUrl.hostname = `www.${parsedUrl.hostname}`;
        return fetch(parsedUrl.toString(), options).then(innerResponse => {
          if (!innerResponse.ok) {
            return Promise.reject(new Error(`HTTP error! status: ${innerResponse.status}`));
          } else {
            return innerResponse.text().then(data => {
              if (!data) {
                return null;
              }
              try {
                return JSON.parse(data);
              } catch {
                return null;
              }
            });
          }
        });
      }
      if (response.status === 401) {
        chrome.storage.sync.remove(['apiKey', 'namespaceId', 'resourceId']);
      }
      return Promise.reject(new Error(`HTTP error! status: ${response.status}`));
    } else {
      return response.text().then(data => {
        if (!data) {
          return null;
        }
        try {
          return JSON.parse(data);
        } catch {
          return null;
        }
      });
    }
  });
}

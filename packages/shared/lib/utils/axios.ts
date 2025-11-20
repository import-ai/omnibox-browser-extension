export function axios(
  url: string,
  opts?: {
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
  params.headers['From'] = 'extension';

  // Set up timeout using AbortController
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  const options: RequestInit = {
    body: params.body,
    redirect: 'manual',
    headers: params.headers,
    method: params.method || 'GET',
    credentials: 'include',
    signal: controller.signal,
  };

  return fetch(params.url, options)
    .then(response => {
      clearTimeout(timeoutId);
      if (!response.ok) {
        if (response.type === 'opaqueredirect') {
          const parsedUrl = new URL(params.url);
          parsedUrl.hostname = `www.${parsedUrl.hostname}`;

          // Create new controller for retry request
          const retryController = new AbortController();
          const retryTimeoutId = setTimeout(() => retryController.abort(), 10000);
          const retryOptions = { ...options, signal: retryController.signal };

          return fetch(parsedUrl.toString(), retryOptions)
            .then(innerResponse => {
              clearTimeout(retryTimeoutId);
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
            })
            .catch(error => {
              clearTimeout(retryTimeoutId);
              if (error.name === 'AbortError') {
                return Promise.reject(new Error('Request timeout after 10 seconds'));
              }
              throw error;
            });
        }
        if (response.status === 401) {
          chrome.storage.sync.remove(['namespaceId', 'resourceId']);
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
    })
    .catch(error => {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        return Promise.reject(new Error('Request timeout after 10 seconds'));
      }
      throw error;
    });
}

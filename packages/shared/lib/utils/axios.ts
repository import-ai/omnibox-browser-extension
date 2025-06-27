import { t } from '@extension/i18n';

const getRedirectURL = (url: string, options: RequestInit): Promise<string> => {
  return new Promise(resolve => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    const { headers = {} } = options;
    Object.keys(headers).forEach(key => {
      if (typeof key === 'string') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        xhr.setRequestHeader(key, headers[key]);
      }
    });
    xhr.send();
    xhr.onreadystatechange = function () {
      if (this.readyState === this.DONE) {
        if (this.responseURL && this.responseURL !== url) {
          resolve(this.responseURL);
          this.abort();
          return;
        }
        console.log('未发生重定向，responseUR 的值为：', this.responseURL);
        resolve('');
      }
    };
    xhr.onerror = function (e) {
      console.log('请求失败', e);
      resolve('');
    };
  });
};

export default function axios(
  url: string,
  opts: {
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
  const options: RequestInit = {
    redirect: 'manual',
    body: params.body,
    method: params.method,
    headers: params.headers,
  };
  return fetch(params.url, options).then(response => {
    if (!response.ok) {
      if (response.status === 401) {
        chrome.storage.sync.remove(['apiKey', 'namespaceId', 'spaceType']);
      }
      return Promise.reject(new Error(t('http_error', `${response.status}`)));
    } else {
      if (response.type === 'opaqueredirect') {
        return getRedirectURL(params.url, options).then(redirectURL => {
          if (!redirectURL) {
            throw new Error('未获取到重定向 URL');
          }
          // 自动对重定向的 URL 发起请求
          return fetch(redirectURL, options);
        });
      }
      return response.json();
    }
  });
}

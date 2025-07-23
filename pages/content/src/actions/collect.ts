export function collect(
  option: {
    [index: string]: string;
  },
  callback: (response: {
    data?: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      [index: string]: any;
    };
    error?: string;
  }) => void,
) {
  const { action, apiBaseUrl, apiKey, namespaceId, resourceId } = option;
  chrome.runtime.sendMessage(
    {
      apiKey,
      resourceId,
      namespaceId,
      type: action,
      action: 'collect',
      baseUrl: apiBaseUrl,
      pageUrl: document.URL,
      pageTitle: document.title,
      data: document.documentElement.outerHTML,
    },
    callback,
  );
}

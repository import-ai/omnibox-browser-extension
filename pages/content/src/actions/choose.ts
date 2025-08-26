import chooseFN from '../utils/choose';

let destoryChoose: (() => void) | null = null;

export function choose(
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
  doneCallback: () => void,
) {
  const { action, apiBaseUrl, namespaceId, resourceId } = option;
  if (destoryChoose) {
    destoryChoose();
    destoryChoose = null;
  }
  destoryChoose = chooseFN(node => {
    if (destoryChoose) {
      destoryChoose();
      destoryChoose = null;
    }
    doneCallback();
    chrome.runtime.sendMessage(
      {
        resourceId,
        namespaceId,
        type: action,
        action: 'collect',
        baseUrl: apiBaseUrl,
        pageUrl: document.URL,
        pageTitle: document.title,
        data: `<html><head><title>${document.title}</title></head><body>${node.outerHTML}</body></html>`,
      },
      callback,
    );
  });
}

export function cancelChoose(callback?: () => void) {
  if (destoryChoose) {
    destoryChoose();
    destoryChoose = null;
  }
  if (callback) {
    callback();
  }
}

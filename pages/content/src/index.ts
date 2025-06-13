import { ready } from '@src/utils/ready';
import choose from '@extension/shared/lib/utils/choose';

let destoryChoose: (() => void) | null = null;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // 保存内容
  if (request.action === 'save') {
    const { apiBaseUrl, apiKey, namespaceId, spaceType } = request.option;
    chrome.runtime.sendMessage(
      {
        apiKey,
        spaceType,
        namespaceId,
        action: 'collect',
        baseUrl: apiBaseUrl,
        pageUrl: document.URL,
        pageTitle: document.title,
        data: document.documentElement.outerHTML,
      },
      sendResponse,
    );
  } else if (request.action === 'choose') {
    const { apiBaseUrl, apiKey, namespaceId, spaceType } = request.option;
    if (destoryChoose) {
      destoryChoose();
      destoryChoose = null;
    }
    destoryChoose = choose(node => {
      if (destoryChoose) {
        destoryChoose();
        destoryChoose = null;
      }
      chrome.runtime.sendMessage(
        {
          apiKey,
          spaceType,
          namespaceId,
          action: 'collect',
          baseUrl: apiBaseUrl,
          data: node.innerHTML,
          pageUrl: document.URL,
          pageTitle: document.title,
        },
        sendResponse,
      );
    });
  } else if (request.action === 'cancel-choose') {
    if (destoryChoose) {
      destoryChoose();
      destoryChoose = null;
    }
    sendResponse();
  }
  return true;
});

// 登录页面
if (location.search === '?from=extension') {
  ready(() => {
    chrome.storage.sync.get('apiKey', data => {
      if (data.apiKey) {
        return;
      }
      document.body.setAttribute('data-from-extension', 'true');
      const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'data-token') {
            const token = document.body.getAttribute('data-token');
            if (token) {
              observer.disconnect();
              document.body.removeAttribute('data-from-extension');
              document.body.removeAttribute('data-token');
              chrome.runtime.sendMessage({
                action: 'saveToken',
                token,
              });
            }
          }
        }
      });
      observer.observe(document.body, {
        subtree: false,
        attributes: true,
        attributeFilter: ['data-token'],
      });
    });
  });
}

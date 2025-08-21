import 'webextension-polyfill';
import axios from '@extension/shared/lib/utils/axios';

let status = '';
let queryed = false;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'collect') {
    status = request.type;
    axios(`${request.baseUrl.endsWith('/') ? request.baseUrl.slice(0, -1) : request.baseUrl}/api/v1/wizard/collect`, {
      apiKey: request.apiKey,
      data: {
        html: request.data,
        url: request.pageUrl,
        title: request.pageTitle,
        parentId: request.resourceId,
        namespace_id: request.namespaceId,
      },
    })
      .then(data => {
        sendResponse({ data: data });
        if (status && queryed) {
          chrome.runtime.sendMessage({ action: 'sync-status', type: status, data: data }, () => {
            status = '';
          });
        }
      })
      .catch(error => {
        sendResponse({ error: error.toString() });
        if (status && queryed) {
          chrome.runtime.sendMessage({ action: 'sync-status', type: status, error: error.toString() }, () => {
            status = '';
          });
        }
      })
      .finally(() => {
        status = '';
        queryed = false;
      });
  } else if (request.action === 'status') {
    sendResponse({ data: status });
    if (status) {
      queryed = true;
    }
  } else if (request.action === 'oauth') {
    chrome.storage.sync.get(['apiBaseUrl'], options => {
      const baseUrl = options.apiBaseUrl || 'https://www.omnibox.pro';
      axios(`${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}/api/v1/oauth2/token`, {
        data: {
          code: request.code,
          state: request.state,
          grant_type: 'authorization_code',
          client_id: 'omnibox-client-chrome',
        },
      }).then(response => {
        chrome.storage.sync.set({ apiKey: response.access_token }, () => {
          sendResponse();
          if (sender.tab && sender.tab.id) {
            chrome.tabs.remove(sender.tab.id);
          }
        });
      });
    });
  } else if (request.action === 'create-tab') {
    chrome.tabs.create({ url: request.url }, sendResponse);
  }
  return true;
});

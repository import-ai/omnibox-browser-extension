import 'webextension-polyfill';
import axios from '@extension/shared/lib/utils/axios';

let status = '';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'collect') {
    status = request.type;
    if (request.type === 'choose') {
      chrome.action.openPopup();
    }
    axios(`${request.baseUrl.endsWith('/') ? request.baseUrl.slice(0, -1) : request.baseUrl}/api/v1/wizard/collect`, {
      apiKey: request.apiKey,
      data: {
        html: request.data,
        url: request.pageUrl,
        title: request.pageTitle,
        space_type: request.spaceType,
        namespace_id: request.namespaceId,
      },
    })
      .then(data => {
        sendResponse({ data: data });
        if (status) {
          chrome.runtime.sendMessage({ action: 'sync-status', type: status, data: data }, () => {
            status = '';
          });
        }
      })
      .catch(error => {
        sendResponse({ error: error.toString() });
        if (status) {
          chrome.runtime.sendMessage({ action: 'sync-status', type: status, error: error.toString() }, () => {
            status = '';
          });
        }
      })
      .finally(() => {
        status = '';
      });
    return true;
  } else if (request.action === 'status') {
    sendResponse({ data: status });
  } else if (request.action === 'saveToken') {
    chrome.storage.sync.set({ apiKey: request.token }, () => {
      sendResponse();
      if (sender.tab && sender.tab.id) {
        chrome.tabs.remove(sender.tab.id);
      }
    });
    return true;
  }
  return true;
});

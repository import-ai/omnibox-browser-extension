import 'webextension-polyfill';
import { isInternalUrl, compress } from './utils';
import { axios, track } from '@extension/shared';

self.addEventListener('unhandledrejection', e => {
  e.preventDefault();
  console.log(e);
});

// Handle action icon click to toggle popup in content script
chrome.action.onClicked.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const tab = tabs[0];
    if (tab?.id && tab.url && !isInternalUrl(tab.url)) {
      chrome.tabs.sendMessage(tab.id, { action: 'toggle-popup' });
    }
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'collect') {
    compress(request.data, 'gzip').then(compressedHtml => {
      const formData = new FormData();
      formData.append('url', request.pageUrl);
      formData.append('title', request.pageTitle);
      formData.append('parentId', request.resourceId);
      formData.append('namespace_id', request.namespaceId);
      formData.append('html', new Blob([compressedHtml], { type: 'application/gzip' }), 'html.gz');
      axios(
        `${request.baseUrl.endsWith('/') ? request.baseUrl.slice(0, -1) : request.baseUrl}/api/v1/wizard/collect/gzip`,
        {
          method: 'POST',
          body: formData,
          headers: {},
        },
      )
        .then(data => {
          sendResponse({ data: data });
        })
        .catch(error => {
          sendResponse({ error: error.toString() });
        });
    });
  } else if (request.action === 'fetch') {
    axios(request.url, {
      data: request.data,
      query: request.query,
    })
      .then(data => {
        sendResponse({ data: data });
      })
      .catch(error => {
        sendResponse({ error: error.toString() });
      });
  } else if (request.action === 'storage') {
    chrome.storage.sync
      .get(request.args)
      .then(data => {
        sendResponse({ data: data });
      })
      .catch(error => {
        sendResponse({ error: error.toString() });
      });
  } else if (request.action === 'set-storage') {
    chrome.storage.sync
      .set(request.args)
      .then(data => {
        sendResponse({ data: data });
      })
      .catch(error => {
        sendResponse({ error: error.toString() });
      });
  } else if (request.action === 'remove-storage') {
    chrome.storage.sync.remove(request.args).finally(sendResponse);
  } else if (request.action === 'track') {
    sendResponse();
    track(request.name, request.payload);
  } else if (request.action === 'create-tab') {
    chrome.tabs.create({ url: request.url }, sendResponse);
  } else if (request.action === 'close-tab') {
    if (sender.tab && sender.tab.id) {
      chrome.tabs.remove(sender.tab.id);
    }
  } else if (request.action === 'open-options') {
    chrome.runtime.openOptionsPage();
  }
  return true;
});

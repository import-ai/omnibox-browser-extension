import 'webextension-polyfill';
import { isInternalUrl } from './utils';
import { axios } from '@extension/shared';

// Update extension icon state based on current tab
function updateIconState(tabId: number, url: string) {
  chrome.action.setTitle({
    tabId,
    title: isInternalUrl(url) ? 'Cannot inject content script on this page' : 'Show Omnibox popup',
  });
}

// Listen for tab updates to update icon state
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    updateIconState(tabId, tab.url);
  }
});

// Listen for tab activation to update icon state
chrome.tabs.onActivated.addListener(activeInfo => {
  chrome.tabs.get(activeInfo.tabId, tab => {
    if (tab.url) {
      updateIconState(activeInfo.tabId, tab.url);
    }
  });
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
    axios(`${request.baseUrl.endsWith('/') ? request.baseUrl.slice(0, -1) : request.baseUrl}/api/v1/wizard/collect`, {
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
      })
      .catch(error => {
        sendResponse({ error: error.toString() });
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

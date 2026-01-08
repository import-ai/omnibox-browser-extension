import 'webextension-polyfill';
import { canInjectScripts, compress } from './utils';
import { axios, track } from '@extension/shared';

// Track ready content scripts by tab ID
const readyTabs = new Set<number>();

// Track uninstall event
chrome.runtime.onInstalled.addListener(async () => {
  const storage = await chrome.storage.sync.get('apiBaseUrl');
  const baseUrl = storage.apiBaseUrl || 'https://www.omnibox.pro';
  chrome.runtime.setUninstallURL(
    `${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}/feedback?from=extension&reason=uninstall`,
  );
});

// Track extension icon pinning action (V3 only)
// This API is not available in V2
if (chrome.action && chrome.action.onUserSettingsChanged) {
  chrome.action.onUserSettingsChanged.addListener(async userSettings => {
    if (userSettings.isOnToolbar !== undefined) {
      await track('extension_icon_pinned', {
        pinned: userSettings.isOnToolbar ? '1' : '0',
      });
    }
  });
}

// Handle unhandled promise rejections for both V2 and V3
if (typeof self !== 'undefined' && self.addEventListener) {
  // V3 Service Worker
  self.addEventListener('unhandledrejection', e => {
    e.preventDefault();
    console.log(e);
  });
} else if (typeof window !== 'undefined' && window.addEventListener) {
  // V2 Background Page
  window.addEventListener('unhandledrejection', e => {
    e.preventDefault();
    console.log(e);
  });
}

// Handle action icon click to toggle popup in content script
// Support both V2 (browserAction) and V3 (action)
const actionAPI =
  chrome.action ||
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (chrome as any).browserAction;

// Update pop-up windows based on whether scripts can be injected
async function updatePopupForTab(tabId: number) {
  if (actionAPI && typeof actionAPI.setPopup === 'function') {
    const canInject = await canInjectScripts(tabId, readyTabs);
    const popup = canInject ? '' : 'restricted-popup.html';
    actionAPI.setPopup({ popup, tabId });
  }
}

// Pop up window for dynamic settings of restricted pages
if (actionAPI && typeof actionAPI.setPopup === 'function') {
  chrome.tabs.onActivated.addListener(async activeInfo => {
    await updatePopupForTab(activeInfo.tabId);
  });

  // Listen for tab URL updates
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // Clear ready state when URL changes (page navigation)
    if (changeInfo.url) {
      readyTabs.delete(tabId);
    }
    if (tab.active && (changeInfo.url || changeInfo.status === 'complete')) {
      updatePopupForTab(tabId);
    }
  });
}

// Clean up readyTabs when tab is closed
chrome.tabs.onRemoved.addListener(tabId => {
  readyTabs.delete(tabId);
});

if (actionAPI && actionAPI.onClicked) {
  actionAPI.onClicked.addListener(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const tab = tabs[0];
      if (tab?.id && tab.url) {
        const tabId = tab.id;
        chrome.tabs.sendMessage(tabId, { action: 'toggle-popup' }, () => {
          // Check if there was an error sending the message
          const lastError = chrome.runtime.lastError;
          if (lastError) {
            // If the receiving end does not exist (content script not loaded),
            // reload the tab to inject the content script
            if (lastError.message?.includes('Receiving end does not exist')) {
              if (!tab.url?.includes('omnibox.pro')) {
                chrome.tabs.reload(tabId);
              }
            } else {
              console.error('Error sending message to content script:', lastError);
            }
          }
        });
      }
    });
  });
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === '__content_ready__') {
    if (sender.tab?.id) {
      readyTabs.add(sender.tab.id);
      updatePopupForTab(sender.tab.id);
    }
    return;
  }
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

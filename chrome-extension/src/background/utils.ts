export async function canInjectScripts(tabId: number, readyTabs?: Set<number>): Promise<boolean> {
  try {
    // Get the tab's URL
    const tab = await chrome.tabs.get(tabId);
    if (!tab.url) {
      return false;
    }

    // Get user's configured apiBaseUrl from storage
    const storage = await chrome.storage.sync.get('apiBaseUrl');
    const apiBaseUrl = storage.apiBaseUrl || 'https://www.omnibox.pro';

    try {
      const tabUrl = new URL(tab.url);
      const configUrl = new URL(apiBaseUrl);

      // Rule 1: If current page origin matches configured apiBaseUrl, restrict it
      if (tabUrl.origin === configUrl.origin) {
        return false;
      }

      // Rule 2: Always restrict omnibox.pro domain (including all subdomains)
      if (tabUrl.hostname.includes('omnibox.pro')) {
        return false;
      }
    } catch (e) {
      // Invalid URL, will be caught by ping check below
    }

    // Rule 3: Check if content script has reported ready
    if (readyTabs?.has(tabId)) {
      return true;
    }

    // Rule 4: Fallback to ping for compatibility
    return new Promise(resolve => {
      chrome.tabs.sendMessage(tabId, { action: '__ping__' }, () => {
        const err = chrome.runtime.lastError;
        if (err) {
          // Cannot inject scripts (browser restricted page)
          resolve(false);
        } else {
          // Content script is loaded and responded
          resolve(true);
        }
      });
    });
  } catch (error) {
    return false;
  }
}

export function compress(html: string, encoding: 'gzip') {
  const byteArray = new TextEncoder().encode(html);
  const cs = new CompressionStream(encoding);
  const writer = cs.writable.getWriter();
  writer.write(byteArray);
  writer.close();
  return new Response(cs.readable).arrayBuffer();
}

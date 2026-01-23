const INTERNAL_URL_PREFIXES = [
  'chrome://',
  'chrome-extension://',
  'moz-extension://',
  'about:',
  'edge://',
  'opera://',
  'safari-extension://',
];

// Truly restricted page prefixes (cannot inject Content Script)
const TRULY_RESTRICTED_PREFIXES = [
  'chrome://',
  'chrome-extension://',
  'moz-extension://',
  'about:',
  'edge://',
  'opera://',
  'safari-extension://',
  'devtools://',
];

// Extension store pages - browsers block content script injection on these pages
const TRULY_RESTRICTED_PATTERNS = [
  'chromewebstore.google.com',
  'microsoftedge.microsoft.com',
  'addons.mozilla.org',
  'addons.opera.com',
];

export function isTrulyRestricted(url: string): boolean {
  if (!url) return true;
  // Check prefixes - these are pages where content scripts absolutely cannot be injected
  if (TRULY_RESTRICTED_PREFIXES.some(prefix => url.startsWith(prefix))) {
    return true;
  }
  // Check patterns - extension store pages where browsers block content script injection
  if (TRULY_RESTRICTED_PATTERNS.some(pattern => url.includes(pattern))) {
    return true;
  }
  return false;
}

const INTERNAL_URL_PATTERNS = [
  'microsoftedge.microsoft.com',
  'chromewebstore.google.com',
  'addons.mozilla.org',
  'addons.opera.com',
];

export function isInternalUrl(url: string): boolean {
  if (!url) {
    return true;
  }

  for (const prefix of INTERNAL_URL_PREFIXES) {
    if (url.startsWith(prefix)) {
      return true;
    }
  }

  for (const pattern of INTERNAL_URL_PATTERNS) {
    if (url.includes(pattern)) {
      return true;
    }
  }

  return false;
}

export type RestrictionType = 'browser-internal' | 'webstore' | 'omnibox-pro' | null;

export interface PageAccessInfo {
  canInject: boolean;
  restrictionType: RestrictionType;
}

export async function canInjectScripts(tabId: number, readyTabs?: Set<number>): Promise<PageAccessInfo> {
  try {
    // Get the tab's URL
    const tab = await chrome.tabs.get(tabId);
    if (!tab.url) {
      return { canInject: false, restrictionType: 'browser-internal' };
    }

    // Check if URL is internal/restricted
    if (isInternalUrl(tab.url)) {
      // Determine specific restriction type
      const url = tab.url;

      // Check if it's a webstore URL
      if (
        url.includes('chromewebstore.google.com') ||
        url.includes('microsoftedge.microsoft.com') ||
        url.includes('addons.mozilla.org') ||
        url.includes('addons.opera.com')
      ) {
        return { canInject: false, restrictionType: 'webstore' };
      }

      // Otherwise it's a browser internal page
      return { canInject: false, restrictionType: 'browser-internal' };
    }

    // Get user's configured apiBaseUrl from storage
    const storage = await chrome.storage.sync.get('apiBaseUrl');
    const apiBaseUrl = storage.apiBaseUrl || 'https://www.omnibox.pro';

    try {
      const tabUrl = new URL(tab.url);
      const configUrl = new URL(apiBaseUrl);

      // Rule 1: If current page origin matches configured apiBaseUrl, restrict it
      if (tabUrl.origin === configUrl.origin) {
        return { canInject: false, restrictionType: 'omnibox-pro' };
      }

      // Rule 2: Always restrict omnibox.pro domain (including all subdomains)
      if (tabUrl.hostname.includes('omnibox.pro')) {
        return { canInject: false, restrictionType: 'omnibox-pro' };
      }
    } catch (e) {
      // Invalid URL
    }

    // Rule 3: Check if content script has reported ready
    if (readyTabs?.has(tabId)) {
      return { canInject: true, restrictionType: null };
    }

    // Rule 4: For normal web pages, even if content script is not loaded yet,
    // return true to allow onClicked to trigger and reload the page
    // Only return false for truly restricted pages (already checked above)
    return { canInject: true, restrictionType: null };
  } catch (error) {
    return { canInject: false, restrictionType: 'browser-internal' };
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

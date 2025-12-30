const INTERNAL_URL_PREFIXES = [
  'chrome://',
  'chrome-extension://',
  'moz-extension://',
  'about:',
  'edge://',
  'opera://',
  'safari-extension://',
];

const INTERNAL_URL_PATTERNS = [
  'chromewebstore.google.com',
  'microsoftedge.microsoft.com/addons',
  'addons.mozilla.org',
  'addons.opera.com',
  'omnibox.pro',
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

export function compress(html: string, encoding: 'gzip') {
  const byteArray = new TextEncoder().encode(html);
  const cs = new CompressionStream(encoding);
  const writer = cs.writable.getWriter();
  writer.write(byteArray);
  writer.close();
  return new Response(cs.readable).arrayBuffer();
}

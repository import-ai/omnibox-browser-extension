export function isInternalUrl(url: string): boolean {
  if (!url) {
    return true;
  }
  return (
    url.startsWith('chrome://') ||
    url.startsWith('chrome-extension://') ||
    url.startsWith('moz-extension://') ||
    url.startsWith('about:') ||
    url.startsWith('edge://') ||
    url.startsWith('opera://') ||
    url.startsWith('safari-extension://')
  );
}

export function compress(html: string, encoding: 'gzip') {
  const byteArray = new TextEncoder().encode(html);
  const cs = new CompressionStream(encoding);
  const writer = cs.writable.getWriter();
  writer.write(byteArray);
  writer.close();
  return new Response(cs.readable).arrayBuffer();
}

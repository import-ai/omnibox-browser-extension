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

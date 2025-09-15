export function extPage(url = location.href) {
  return (
    url.startsWith('chrome') ||
    url.startsWith('edge') ||
    url.startsWith('opera') ||
    url.startsWith('extension') ||
    url.startsWith('vivaldi') ||
    url.startsWith('whale') ||
    url.startsWith('ms-browser') ||
    url.startsWith('moz-extension') ||
    url.startsWith('safari-web-extension')
  );
}

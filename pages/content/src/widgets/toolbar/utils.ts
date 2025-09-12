export function getSelectionText() {
  const selection = window.getSelection();
  const selectedText = selection?.toString().trim();
  return selectedText || '';
}

export function hasSelection() {
  const selectionText = getSelectionText();
  return selectionText.length > 0;
}

export function getFaviconUrl() {
  const links = Array.from(document.querySelectorAll('link[rel*="icon"]'));

  for (const link of links) {
    const href = (link as HTMLLinkElement).href;
    if (href) {
      return href;
    }
  }

  return `${location.origin}/favicon.ico`;
}

export function clearSelection() {
  const selection = window.getSelection();
  if (selection) {
    selection.removeAllRanges();
  }
}

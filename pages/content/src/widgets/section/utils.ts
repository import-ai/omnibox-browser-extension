export function getElementType(element: HTMLElement): 'text' | 'image' | 'link' | null {
  if (element.tagName === 'IMG') {
    return 'image';
  }
  if (element.tagName === 'A' || element.closest('a')) {
    return 'link';
  }
  if (element.textContent && element.textContent.trim().length > 0) {
    const tagName = element.tagName.toLowerCase();
    if (
      ['p', 'div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'article', 'section', 'li', 'td', 'th'].includes(tagName)
    ) {
      return 'text';
    }
  }
  return null;
}

export function getElementContent(element: HTMLElement, type: 'text' | 'image' | 'link'): string {
  switch (type) {
    case 'image': {
      const img = element as HTMLImageElement;
      return img.alt || img.src || 'default_image';
    }
    case 'link': {
      const linkElement = element.tagName === 'A' ? element : element.closest('a');
      return linkElement?.textContent?.trim() || linkElement?.getAttribute('href') || 'default_link';
    }
    case 'text':
      return element.textContent?.trim() || '';
    default:
      return '';
  }
}

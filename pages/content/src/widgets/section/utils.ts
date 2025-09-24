function isHiddenElement(e: Element) {
  const style = window.getComputedStyle(e);
  if (style.display === 'none') {
    return true;
  }
  if (style.visibility === 'hidden') {
    return true;
  }
  if (style.opacity === '0') {
    return true;
  }
  return e.checkVisibility && !e.checkVisibility();
}

function isExcludedTag(e: Element): boolean {
  const excludedTags = [
    'script',
    'button',
    'table',
    'video',
    'input',
    'textarea',
    'style',
    'svg',
    'path',
    'iframe',
    'canvas',
    'html',
    'body',
    'audio',
    'select',
    'tbody',
    'tr',
    'tfoot',
    'thead',
    'track',
  ];
  return excludedTags.includes(e.localName);
}

function isAllowedTag(e: Element): boolean {
  const allowedTags = ['img', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'section'];
  return allowedTags.includes(e.localName);
}

function isEmptyText(e: HTMLElement): boolean {
  return !e.innerText || e.innerText.trim() === '';
}

function isOversizedElement(e: HTMLElement, rect: DOMRect): boolean {
  return rect.width >= window.innerWidth || (rect.height >= window.innerHeight && e.innerText.length < 100);
}

function isInlineDisplay(e: HTMLElement): boolean {
  return window.getComputedStyle(e).display.startsWith('inline');
}

function isSingleChildSameText(e: HTMLElement): boolean {
  return !!(
    e.children.length === 1 &&
    e.innerText &&
    e.innerText.replaceAll('\n', '').trim() === (e.children[0] as HTMLElement).innerText.replaceAll('\n', '').trim()
  );
}

function isMultiChildOversized(e: HTMLElement, rect: DOMRect): boolean {
  return e.children.length > 1 && rect.height >= Math.max(window.innerHeight, 1080);
}

function isInvalidRatioOrNumber(e: HTMLElement, rect: DOMRect): boolean {
  const ratio = rect.width / rect.height;
  return (
    (ratio <= 1 / 3 && e.innerText.length < 100) ||
    (!isNaN(Number(e.innerText)) && Number(e.innerText) < 1000) ||
    (ratio < 1.5 && ratio > 0.5 && e.innerText.length < 100 && rect.height < 30)
  );
}

function isSingleImgChildSameText(e: HTMLElement): boolean {
  return !!(
    e.children.length === 1 &&
    e.children[0].localName === 'img' &&
    e.innerText &&
    e.innerText.replaceAll('\n', '').trim() === (e.children[0] as HTMLElement).innerText.replaceAll('\n', '').trim()
  );
}

function isAllButtonChildren(e: HTMLElement): boolean {
  return e.children.length > 0 && Array.from(e.children).every(child => child.localName === 'button');
}

function isSpecialSiteExcluded(e: HTMLElement): boolean {
  if (window.location.hostname === 'www.bilibili.com') {
    const a = document.getElementById('bilibili-player');
    const u = document.getElementById('playerWrap');
    if ((a && a.contains(e)) || (u && u.contains(e))) return true;
  }
  if (window.location.hostname === 'www.youtube.com' && ['movie_player', 'player'].includes(e.id)) return true;
  return false;
}

function isValidElement(e: Element) {
  if (!(e instanceof HTMLElement)) return false;

  if (isAllowedTag(e)) {
    return true;
  }

  const rect = e.getBoundingClientRect();

  if (
    isExcludedTag(e) ||
    isEmptyText(e) ||
    isHiddenElement(e) ||
    isOversizedElement(e, rect) ||
    isInlineDisplay(e) ||
    isSingleChildSameText(e) ||
    isMultiChildOversized(e, rect)
  ) {
    return false;
  }

  if (isInvalidRatioOrNumber(e, rect) || isSingleImgChildSameText(e) || isAllButtonChildren(e)) {
    return false;
  }

  if (isSpecialSiteExcluded(e)) {
    return false;
  }

  return true;
}

function isElementBehindHighlighted(target: Element, dist: Element): boolean {
  const targetRect = target.getBoundingClientRect();
  const distRect = dist.getBoundingClientRect();

  return (
    targetRect.left < distRect.right &&
    targetRect.right > distRect.left &&
    targetRect.top < distRect.bottom &&
    targetRect.bottom > distRect.top
  );
}

export function isElementIntersection(
  shadow: ShadowRoot,
  element: Element,
): {
  id: string;
  element: Element;
  intersection: boolean;
} {
  const defaultValue: {
    id: string;
    element: Element;
    intersection: boolean;
  } = {
    id: '',
    element,
    intersection: false,
  };
  Array.from(shadow.querySelectorAll('.js-omnibox-overlay')).every(overlay => {
    if (isElementBehindHighlighted(overlay, element)) {
      defaultValue.id = overlay.getAttribute('data-id') || '';
      defaultValue.intersection = true;
      return false;
    }
    return true;
  });
  return defaultValue;
}

export function availableElements(elements: Element[]): Element | undefined {
  return elements.find(isValidElement);
}

export function getElementId(element: Element): string {
  if (!(element instanceof HTMLElement)) {
    return Math.random().toString(36).slice(2);
  }
  const rect = element.getBoundingClientRect();
  const text = element.innerText?.replaceAll('\n', '').trim() || '';
  const tag = element.tagName;
  const pos = `${Math.round(rect.left)},${Math.round(rect.top)},${Math.round(rect.width)},${Math.round(rect.height)}`;
  const structure = Array.from(element.children)
    .map(e => e.tagName)
    .join(',');
  return `${tag}|${text.slice(0, 30)}|${pos}|${structure}`;
}

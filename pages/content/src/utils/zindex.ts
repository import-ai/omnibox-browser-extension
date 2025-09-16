import { isNumber } from './is';

declare global {
  interface Document {
    _zindex?: number;
  }
}

export default function zIndex() {
  const zIndex = document._zindex;
  if (isNumber(zIndex)) {
    return zIndex + 1;
  } else {
    let value = 0;
    document.body.querySelectorAll('*').forEach(item => {
      const zindex = Number.parseInt(window.getComputedStyle(item, null).getPropertyValue('z-index'), 10);
      if (zindex > value) {
        value = zindex;
      }
    });
    if (value <= 0) {
      return 1000;
    }
    value++;
    document._zindex = value;
    return value;
  }
}

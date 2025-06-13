import { isElement } from 'lodash-es';

export default function choose(callback: (node: HTMLElement) => void) {
  const className = 'omnibox_choose_node';
  const stylesheet = document.createElement('style');
  stylesheet.textContent = `
    .${className}{
      background:#ddd !important;
      cursor:pointer !important;
      outline:3px dashed #777 !important;
    }';
  `;
  document.body.appendChild(stylesheet);
  function handleMouseover(event: MouseEvent) {
    const target = event.target;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const fromTarget = event.fromElement || event.relatedTarget;
    if (isElement(fromTarget)) {
      fromTarget.classList.remove(className);
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    target.classList.add(className);
  }
  function handleClick(event: MouseEvent) {
    event.stopPropagation();
    event.preventDefault();
    const target = event.target as HTMLElement;
    if (target) {
      callback(target);
    }
  }
  function destory() {
    stylesheet.remove();
    document.removeEventListener('keydown', handleESC);
    document.body.removeEventListener('click', handleClick, true);
    document.body.removeEventListener('mouseover', handleMouseover);
    Array.from(document.body.querySelectorAll(`.${className}`)).forEach(node => {
      node.classList.remove(className);
    });
  }
  function handleESC(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      destory();
    }
  }
  document.addEventListener('keydown', handleESC);
  document.body.addEventListener('click', handleClick, true);
  document.body.addEventListener('mouseover', handleMouseover);
  return destory;
}

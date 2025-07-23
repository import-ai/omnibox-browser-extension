import { isElement } from './is';

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
    const target = event.target as HTMLElement;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const fromTarget = event.fromElement || event.relatedTarget;
    if (isElement(fromTarget)) {
      fromTarget.classList.remove(className);
    }
    if (target.shadowRoot) {
      return;
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    target.classList.add(className);
  }
  function cleanUpScene() {
    Array.from(document.body.querySelectorAll(`.${className}`)).forEach(node => {
      node.classList.remove(className);
    });
  }
  function handleClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target.shadowRoot) {
      return;
    }
    event.stopPropagation();
    event.preventDefault();
    callback(target);
  }
  function destory() {
    stylesheet.remove();
    document.body.removeEventListener('click', handleClick, true);
    document.body.removeEventListener('mouseover', handleMouseover);
    document.body.removeEventListener('mouseleave', cleanUpScene);
    cleanUpScene();
  }
  document.body.addEventListener('click', handleClick, true);
  document.body.addEventListener('mouseover', handleMouseover);
  document.body.addEventListener('mouseleave', cleanUpScene);
  return destory;
}

import { cn } from '@extension/ui';

export interface IProps {
  x: number;
  y: number;
  w: number;
  h: number;
  id: string;
  active?: boolean;
  element: Element;
}

export function ActiveElement(props: IProps) {
  const { element, id, active } = props;
  const rect = element.getBoundingClientRect();
  // Use absolute positioning with scroll offset - element scrolls with page naturally
  const x = rect.x + window.scrollX;
  const y = rect.y + window.scrollY;

  return (
    <div
      data-id={id}
      className={cn('absolute box-border rounded-[8px] bg-[rgba(44,70,241,0.3)] pointer-events-none', {
        'js-omnibox-overlay border border-solid border-[#2c46f1]': active,
      })}
      style={{
        width: rect.width,
        height: rect.height,
        left: x,
        top: y,
      }}
    />
  );
}

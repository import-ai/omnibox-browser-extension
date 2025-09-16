import { cn } from '@extension/ui';

export interface IProps {
  x: number;
  y: number;
  w: number;
  h: number;
  id: string;
  active?: boolean;
}

export function ActiveElement(props: IProps) {
  const { x, y, w, h, id, active } = props;

  return (
    <div
      data-id={id}
      className={cn('fixed box-border rounded-[8px] bg-[rgba(44,70,241,0.3)]', {
        'js-omnibox-overlay border border-solid border-[#2c46f1]': active,
      })}
      style={{
        width: w,
        height: h,
        transform: `translateX(${x}px) translateY(${y}px) translateZ(0px)`,
      }}
    />
  );
}

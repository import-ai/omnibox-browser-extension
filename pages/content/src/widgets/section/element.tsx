import { cn } from '@extension/ui';
import { useRef, useLayoutEffect } from 'react';

export interface IProps {
  x: number;
  y: number;
  w: number;
  h: number;
  id: string;
  active?: boolean;
  element: Element;
  firstElement?: Element;
}

export function ActiveElement(props: IProps) {
  const { id, active, element, firstElement } = props;
  const divRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useLayoutEffect(() => {
    const updatePosition = () => {
      if (!divRef.current || !document.contains(element)) return;
      const rect = element.getBoundingClientRect();
      let x: number, y: number, w: number, h: number;

      if (firstElement && document.contains(firstElement)) {
        const firstRect = firstElement.getBoundingClientRect();
        x = firstRect.x;
        y = firstRect.y;
        w = rect.width;
        h = rect.bottom - firstRect.top;
      } else {
        x = rect.x;
        y = rect.y;
        w = rect.width;
        h = rect.height;
      }

      // Direct DOM manipulation for fastest update
      divRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      divRef.current.style.width = `${w}px`;
      divRef.current.style.height = `${h}px`;
    };

    const handleScroll = () => {
      // Cancel previous frame if still pending
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      // Schedule update for next frame
      rafRef.current = requestAnimationFrame(updatePosition);
    };

    // Initial position
    updatePosition();

    // Listen for scroll events
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', updatePosition);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [element, firstElement]);

  return (
    <div
      ref={divRef}
      data-id={id}
      className={cn('fixed top-0 left-0 box-border rounded-[8px] bg-[rgba(44,70,241,0.3)]', {
        'js-omnibox-overlay border border-solid border-[#2c46f1]': active,
      })}
      style={{
        willChange: 'transform',
      }}
    />
  );
}

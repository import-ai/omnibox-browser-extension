import limit from '@src/utils/limit';
import zIndex from '@src/utils/zindex';
import getPosition from '@src/utils/position';
import getTransform from '@src/utils/transform';
import { useRef, useState, useEffect } from 'react';

interface IProps {
  children: React.ReactNode;
}

export function Wrapper(props: IProps) {
  const { children } = props;
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const container = ref.current as HTMLElement;
    if (!container) {
      return;
    }
    const limitValue = limit({
      x: 0,
      y: 0,
    });
    const posX = limitValue.x;
    const posY = limitValue.y;
    let startX = posX;
    let startY = posY;
    let offsetX = 0;
    let offsetY = 0;

    let isDragging = false;

    function handleStart(event: MouseEvent | TouchEvent) {
      if (isDragging) {
        return;
      }

      isDragging = true;

      event.preventDefault();
      event.stopPropagation();

      const pos = getPosition(event);
      startX = pos.x;
      startY = pos.y;
      const trans = getTransform(container);
      offsetX = trans.x;
      offsetY = trans.y;

      const endEvent = event.type === 'touchstart' ? 'touchend' : 'mouseup';
      const moveEvent = event.type === 'touchstart' ? 'touchmove' : 'mousemove';

      document.addEventListener(moveEvent, handleMove, { passive: false });
      document.addEventListener(endEvent, handleEnd, { passive: false });
    }

    function handleMove(event: MouseEvent | TouchEvent) {
      if (!isDragging) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const pos = getPosition(event);
      const deltaX = pos.x - startX;
      const deltaY = pos.y - startY;
      const returnValue = limit({ x: offsetX + deltaX, y: offsetY + deltaY });
      setPosition(returnValue);
    }

    function handleEnd(event: MouseEvent | TouchEvent) {
      isDragging = false;

      event.preventDefault();
      event.stopPropagation();

      const moveEvent = event.type === 'touchend' ? 'touchmove' : 'mousemove';
      const endEvent = event.type === 'touchend' ? 'touchend' : 'mouseup';

      document.removeEventListener(moveEvent, handleMove);
      document.removeEventListener(endEvent, handleEnd);
    }

    container.addEventListener('mousedown', handleStart);
    container.addEventListener('touchstart', handleStart, {
      passive: false,
    });
    return () => {
      container.removeEventListener('mousedown', handleStart);
      container.removeEventListener('touchstart', handleStart);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`fixed left-[50%] ml-[-130px] top-[50px] cursor-move rounded-[16px] min-w-[260px] bg-background text-foreground`}
      style={{
        zIndex: zIndex(),
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      }}>
      {children}
    </div>
  );
}

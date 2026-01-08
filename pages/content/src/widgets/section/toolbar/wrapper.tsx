import zIndex from '@src/utils/zindex';
import { useState, useEffect } from 'react';

interface IProps {
  toolbar: string;
  point: { x: number; y: number; isTop?: boolean };
  children: React.ReactNode;
}

export function Wrapper(props: IProps) {
  const { point, toolbar, children } = props;

  // Store document position (viewport + scroll at capture time)
  const [docPos, setDocPos] = useState(() => ({
    x: point.x + window.scrollX,
    y: point.y + window.scrollY,
  }));

  // Track scroll offset for re-render
  const [scrollOffset, setScrollOffset] = useState({ x: window.scrollX, y: window.scrollY });

  // Update document position when point changes
  useEffect(() => {
    setDocPos({
      x: point.x + window.scrollX,
      y: point.y + window.scrollY,
    });
  }, [point.x, point.y]);

  // Update scroll offset on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrollOffset({ x: window.scrollX, y: window.scrollY });
    };
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, []);

  if (toolbar.length <= 0) {
    return null;
  }

  // Convert document position to viewport position
  const viewportX = docPos.x - scrollOffset.x;
  const viewportY = docPos.y - scrollOffset.y;

  const isTop = point.isTop ?? true;

  return (
    <div
      className={`js-toolbar fixed min-w-[70px] text-foreground bg-background rounded-[8px] shadow-[0px_4px_18px_0px_rgba(0,0,0,0.1)]`}
      style={{
        zIndex: zIndex(),
        top: `${viewportY}px`,
        left: `${viewportX}px`,
        transform: isTop ? 'translate(-50%, -100%)' : 'translate(-50%, 0)',
      }}>
      {children}
    </div>
  );
}

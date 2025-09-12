import { hasSelection } from './utils';
import zIndex from '@src/utils/zindex';
import { useState, useEffect } from 'react';

interface Position {
  x: number;
  y: number;
}

interface IProps {
  popup: boolean;
  toolbar: boolean;
  onToolbar: (toolbar: boolean) => void;
  children: React.ReactNode;
  disableTemp: boolean;
}

export function Wrapper(props: IProps) {
  const { popup, toolbar, onToolbar, children, disableTemp } = props;
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => {
      if (!open) {
        return;
      }
      onToolbar(false);
    };
    const handleMouseUp = (event: MouseEvent) => {
      if (disableTemp) {
        return;
      }
      // Show toolbar only when mouse is released and text is selected
      if (hasSelection()) {
        // Don't show toolbar if popup is visible
        if (popup) {
          return;
        }

        // Use pageX/pageY to include scroll offset for absolute positioning
        let x = event.pageX;
        let y = event.pageY;

        // Basic edge adjustment to keep toolbar on screen
        const toolbarWidth = 70;
        const toolbarHeight = 40; // Approximate height

        // Adjust if too close to edges (considering scroll position)
        if (x + toolbarWidth / 2 > window.innerWidth + window.scrollX) {
          x = window.innerWidth + window.scrollX - toolbarWidth / 2 - 10;
        } else if (x - toolbarWidth / 2 < window.scrollX) {
          x = window.scrollX + toolbarWidth / 2 + 10;
        }

        if (y - toolbarHeight < window.scrollY) {
          y = window.scrollY + toolbarHeight + 10;
        }

        setPosition({ x, y });
        onToolbar(true);
      }
    };
    const handleSelectionChange = () => {
      // Hide toolbar when selection is cleared
      if (!hasSelection()) {
        onToolbar(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('selectionchange', handleSelectionChange);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [popup, disableTemp, toolbar, onToolbar]);

  if (!toolbar) {
    return null;
  }

  return (
    <div
      className={`js-toolbar absolute top-0 bottom-auto left-0 right-auto min-w-[70px] text-foreground bg-background rounded-[8px] shadow-[0px_4px_18px_0px_rgba(0,0,0,0.1)]`}
      style={{
        zIndex: zIndex(),
        top: `${position.y}px`,
        left: `${position.x}px`,
        transform: 'translate(-50%, -100%)',
      }}>
      {children}
    </div>
  );
}

import zIndex from '@src/utils/zindex';
import useApp from '@src/hooks/useApp';
import { useState, useEffect } from 'react';
import { getSelectionText, clearSelection } from './utils';

interface Position {
  x: number;
  y: number;
}

interface IProps {
  popup: boolean;
  toolbar: string;
  onToolbar: (toolbar: string) => void;
  selection: string;
  onSelection: (selection: string) => void;
  children: React.ReactNode;
}

export function Wrapper(props: IProps) {
  const { popup, toolbar, onToolbar, children, selection, onSelection } = props;
  const { shadow } = useApp();
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const zIndexValue = zIndex();
  const hanldeClose = () => {
    onToolbar('');
    onSelection('');
    clearSelection();
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!open) {
        return;
      }
      onToolbar('');
    };
    const handleMouseUp = (event: MouseEvent) => {
      const selectionText = getSelectionText();
      // Show toolbar only when mouse is released and text is selected
      if (selectionText) {
        // Don't show toolbar if popup is visible
        if (popup) {
          return;
        }
        if (shadow.querySelector('.js-omnibox-overlay')) {
          return;
        }
        let x = event.pageX;
        let y = event.pageY;
        const selection = window.getSelection();
        if (selection) {
          const range = selection.getRangeAt(0);
          if (range) {
            const rangeRect = range.getBoundingClientRect();
            if (rangeRect.width <= 0) {
              // Dealing with nested shadowdom, https://www.bilibili.com/video/BV1LN15BLE6f
              return;
            }
            if (x < rangeRect.left || x > rangeRect.right) {
              x = rangeRect.right + window.scrollX;
              y = rangeRect.bottom + window.scrollY;
            }
          }
        }

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
        onToolbar(selectionText);
        onSelection(selectionText);
      }
    };
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [popup, shadow, toolbar, onToolbar, onSelection]);

  if (toolbar.length <= 0 || selection.length <= 0) {
    return null;
  }

  return (
    <>
      <div
        onClick={hanldeClose}
        className="fixed left-0 top-0 w-full h-full"
        style={{
          zIndex: zIndexValue,
        }}
      />
      <div
        className={`js-toolbar absolute top-0 bottom-auto left-0 right-auto min-w-[70px] text-foreground bg-background rounded-[8px] shadow-[0px_4px_18px_0px_rgba(0,0,0,0.1)]`}
        style={{
          zIndex: zIndexValue + 1,
          top: `${position.y}px`,
          left: `${position.x}px`,
          transform: 'translate(-50%, -100%)',
        }}>
        {children}
      </div>
    </>
  );
}

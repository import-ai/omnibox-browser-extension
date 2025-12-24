import zIndex from '@src/utils/zindex';
import useApp from '@src/hooks/useApp';
import { useState, useEffect, useRef } from 'react';
import { getSelectionText } from './utils';

interface Position {
  x: number;
  y: number;
  isTop: boolean;
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
  const [position, setPosition] = useState<Position>({ x: 0, y: 0, isTop: true });
  const showToolbarTimer = useRef<number | null>(null);
  const zIndexValue = zIndex();

  const clearToolbarImmediately = () => {
    if (showToolbarTimer.current) {
      clearTimeout(showToolbarTimer.current);
      showToolbarTimer.current = null;
    }
    onToolbar('');
    onSelection('');
  };

  useEffect(() => {
    const handleScroll = () => {
      // Don't clear if toolbar is not shown
      if (toolbar.length <= 0) {
        return;
      }
      // Don't clear toolbar if Option-selected elements exist
      if (shadow.querySelector('.js-omnibox-overlay')) {
        return;
      }
      // Don't clear if text is still selected
      if (getSelectionText()) {
        return;
      }
      clearToolbarImmediately();
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
        let isTop = true;
        const selection = window.getSelection();
        if (selection) {
          const range = selection.getRangeAt(0);
          if (range) {
            const rangeRect = range.getBoundingClientRect();
            if (rangeRect.width <= 0) {
              // Dealing with nested shadowdom, https://www.bilibili.com/video/BV1LN15BLE6f
              return;
            }

            const TOOLBAR_GAP = 8;
            const toolbarHeight = 40;
            const selectionMidY = rangeRect.top + rangeRect.height / 2;

            // Y position: based on mouse position (top/bottom half of selection)
            isTop = event.clientY < selectionMidY;
            y = isTop ? rangeRect.top + window.scrollY - TOOLBAR_GAP : rangeRect.bottom + window.scrollY + TOOLBAR_GAP;

            // X boundary check: move to selection boundary when mouse is outside selection
            if (x < rangeRect.left + window.scrollX) {
              x = rangeRect.left + window.scrollX;
            } else if (x > rangeRect.right + window.scrollX) {
              x = rangeRect.right + window.scrollX;
            }

            // Y boundary check: switch direction when out of screen
            if (isTop && y - toolbarHeight < window.scrollY) {
              y = rangeRect.bottom + window.scrollY + TOOLBAR_GAP;
              isTop = false;
            } else if (!isTop && y + toolbarHeight > window.innerHeight + window.scrollY) {
              y = rangeRect.top + window.scrollY - TOOLBAR_GAP;
              isTop = true;
            }
          }
        }

        if (showToolbarTimer.current) {
          clearTimeout(showToolbarTimer.current);
          showToolbarTimer.current = null;
        }
        showToolbarTimer.current = window.setTimeout(() => {
          if (!getSelectionText()) {
            clearToolbarImmediately();
            return;
          }

          setPosition({ x, y, isTop });
          onToolbar(selectionText);
          onSelection(selectionText);
        }, 400);
      } else {
        // No text selected - close toolbar immediately
        if (shadow.querySelector('.js-omnibox-overlay')) {
          return;
        }
        clearToolbarImmediately();
      }
    };
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseup', handleMouseUp);
      if (showToolbarTimer.current) {
        clearTimeout(showToolbarTimer.current);
        showToolbarTimer.current = null;
      }
    };
  }, [popup, shadow, toolbar, onToolbar, onSelection]);

  if (toolbar.length <= 0 || selection.length <= 0) {
    return null;
  }

  return (
    <div
      className={`js-toolbar absolute top-0 bottom-auto left-0 right-auto min-w-[70px] text-foreground bg-background rounded-[8px] shadow-[0px_4px_18px_0px_rgba(0,0,0,0.1)]`}
      style={{
        zIndex: zIndexValue,
        top: `${position.y}px`,
        left: `${position.x}px`,
        transform: position.isTop ? 'translate(-50%,-100%)' : 'translate(-50%,0)',
      }}>
      {children}
    </div>
  );
}

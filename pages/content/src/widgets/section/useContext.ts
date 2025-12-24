import useApp from '@src/hooks/useApp';
import type { Storage } from '@extension/shared';
import { useRef, useEffect, useState, useCallback } from 'react';
import { availableElements, getElementId, isElementIntersection } from './utils';

interface Point {
  x: number;
  y: number;
}

interface State {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  text?: string;
  active?: boolean;
  element: Element;
  firstElement?: Element; // For merged items, stores the first element
}

export interface IProps {
  data: Storage;
  onChange: (val: unknown, key?: string) => void;
}

export function useContext(props: IProps) {
  const { data } = props;
  const { shadow } = useApp();
  const timer = useRef<number>(0);
  const draggingRef = useRef(false);
  const dragMoveRef = useRef(false);
  const [cursor, onCursor] = useState(false);
  const [selected, onSelected] = useState<State[]>([]);
  const [point, onPoint] = useState<Point>({ x: 0, y: 0 });
  const saveSection = data.keyboardShortcuts?.saveSection;
  const onDestory = useCallback(() => {
    dragMoveRef.current = false;
    draggingRef.current = false;
    onSelected([]);
    onCursor(false);
  }, []);

  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key !== saveSection) {
        return;
      }
      onCursor(false);
      onSelected(val => {
        return val.filter(item => item.active);
      });
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== saveSection) {
        return;
      }
      // Ignore key repeat events (when holding down the key)
      if (e.repeat) {
        return;
      }
      onCursor(true);
      dragMoveRef.current = false;
      // Keep confirmed selections (active: true), only clear temporary highlights
      onSelected(val => val.filter(item => item.active));
    };
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [saveSection]);

  useEffect(() => {
    // Only clear on resize, not scroll (so selection persists during scroll)
    window.addEventListener('resize', onDestory);
    return () => {
      window.removeEventListener('resize', onDestory);
    };
  }, [onDestory]);

  // Update selected positions on scroll
  useEffect(() => {
    const handleScroll = () => {
      onSelected(val => {
        if (val.length === 0) return val;
        return val.map(item => {
          if (!document.contains(item.element)) return item;
          const rect = item.element.getBoundingClientRect();
          // Handle merged items with firstElement
          if (item.firstElement && document.contains(item.firstElement)) {
            const firstRect = item.firstElement.getBoundingClientRect();
            return {
              ...item,
              x: firstRect.x,
              y: firstRect.y,
              w: rect.width,
              h: rect.bottom - firstRect.top,
            };
          }
          return {
            ...item,
            x: rect.x,
            y: rect.y,
            w: rect.width,
            h: rect.height,
          };
        });
      });
    };
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (!cursor) {
        return;
      }
      if (e.button !== 0) {
        return;
      }
      dragMoveRef.current = false;
      draggingRef.current = true;
    };
    const handleMouseMove = (e: MouseEvent) => {
      if (!cursor) {
        return;
      }
      const now = Date.now();
      if (now - timer.current <= 100) {
        return;
      }
      timer.current = now;
      const elements = document.elementsFromPoint(e.clientX, e.clientY);
      if (elements.length <= 0) {
        return;
      }
      const element = availableElements(elements);
      if (!element) {
        return;
      }
      const returnValue = isElementIntersection(shadow, element);
      if (returnValue.intersection) {
        return;
      }
      if (draggingRef.current) {
        if (!dragMoveRef.current) {
          dragMoveRef.current = true;
        }
        onSelected(val => {
          const rect = element.getBoundingClientRect();
          return [
            ...val.filter(item => item.element !== element),
            {
              element,
              active: true,
              x: rect.x,
              y: rect.y,
              w: rect.width,
              h: rect.height,
              id: getElementId(element),
            },
          ];
        });
        return;
      }
      onSelected(val => {
        const item = val.find(item => item.active && item.element === element);
        if (item) {
          return val.filter(item => item.active);
        }
        const rect = element.getBoundingClientRect();
        return [
          ...val.filter(item => item.active),
          {
            element,
            active: false,
            x: rect.x,
            y: rect.y,
            w: rect.width,
            h: rect.height,
            id: getElementId(element),
          },
        ];
      });
    };
    const handleMouseUp = (e: MouseEvent) => {
      draggingRef.current = false;
      // Only handle left button release, ignore right-click
      if (e.button !== 0) {
        return;
      }
      if (!cursor) {
        const containerRef = shadow.querySelector('.js-toolbar') as HTMLElement;
        if (containerRef) {
          const toolbarElement = shadow.elementFromPoint(e.clientX, e.clientY);
          if (toolbarElement && containerRef.contains(toolbarElement)) {
            return;
          }
        }
        onSelected([]);
        return;
      }
      if (!dragMoveRef.current) {
        const elements = document.elementsFromPoint(e.clientX, e.clientY);
        if (elements.length <= 0) {
          return;
        }
        const element = availableElements(elements);
        if (!element) {
          return;
        }
        const returnValue = isElementIntersection(shadow, element);
        if (returnValue.intersection) {
          onSelected(val => val.filter(item => item.id !== returnValue.id));
          return;
        }
        onSelected(val => {
          const item = val.find(item => item.active && item.element === element);
          if (item) {
            return val.filter(item => item.element !== element);
          }
          const rect = element.getBoundingClientRect();
          return [
            ...val.filter(item => item.active || item.element !== element),
            {
              element,
              active: true,
              x: rect.x,
              y: rect.y,
              w: rect.width,
              h: rect.height,
              id: getElementId(element),
            },
          ];
        });
        onPoint({ x: e.clientX, y: e.clientY });
        return;
      }
      onSelected(val => {
        if (val.length <= 0) {
          return val;
        }
        const sorted = val.sort((a, b) => {
          const ra = a.element.getBoundingClientRect();
          const rb = b.element.getBoundingClientRect();
          return ra.top > rb.top ? 1 : -1;
        });
        const first = sorted[0];
        const last = sorted[sorted.length - 1];
        const firstRect = first.element.getBoundingClientRect();
        const lastRect = last.element.getBoundingClientRect();
        return [
          {
            active: true,
            x: firstRect.x,
            y: firstRect.y,
            w: lastRect.width,
            element: last.element,
            firstElement: first.element,
            h: lastRect.bottom - firstRect.top,
            id: getElementId(last.element),
            text: sorted.map(i => i.element.outerHTML).join(''),
          },
        ];
      });
      onPoint({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [cursor, shadow]);

  return {
    point,
    cursor,
    selected,
    onDestory,
  };
}

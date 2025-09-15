import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@extension/ui';
import { BoxIcon } from '@src/icon/box';
import { useAction } from '@src/provider/useAction';
import type { Storage } from '@extension/shared';
import { useTranslation } from 'react-i18next';

export interface ISectionSelectorProps {
  data: Storage;
  onCancel: () => void;
}

interface SelectedElement {
  element: HTMLElement;
  id: string;
  type: 'text' | 'image' | 'link';
  content: string;
  rect: DOMRect;
}

interface DragSelection {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export function SectionSelector(props: ISectionSelectorProps) {
  const { data, onCancel } = props;
  const { onStatus, onResult } = useAction();
  const { t } = useTranslation();
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);
  const [selectedElements, setSelectedElements] = useState<SelectedElement[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragSelection, setDragSelection] = useState<DragSelection | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const elementIdCounter = useRef(0);
  const DRAG_THRESHOLD = 5;

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onCancel]);

  const getElementType = (element: HTMLElement): 'text' | 'image' | 'link' | null => {
    if (element.tagName === 'IMG') {
      return 'image';
    }
    if (element.tagName === 'A' || element.closest('a')) {
      return 'link';
    }
    if (element.textContent && element.textContent.trim().length > 0) {
      const tagName = element.tagName.toLowerCase();
      if (
        ['p', 'div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'article', 'section', 'li', 'td', 'th'].includes(
          tagName,
        )
      ) {
        return 'text';
      }
    }
    return null;
  };

  const getElementContent = (element: HTMLElement, type: 'text' | 'image' | 'link'): string => {
    switch (type) {
      case 'image': {
        const img = element as HTMLImageElement;
        return img.alt || img.src || t('default_image');
      }
      case 'link': {
        const linkElement = element.tagName === 'A' ? element : element.closest('a');
        return linkElement?.textContent?.trim() || linkElement?.getAttribute('href') || t('default_link');
      }
      case 'text':
        return element.textContent?.trim() || '';
      default:
        return '';
    }
  };

  const isElementSelectable = useCallback((element: HTMLElement): boolean => {
    const type = getElementType(element);
    if (!type) return false;

    const rect = element.getBoundingClientRect();
    if (rect.width < 10 || rect.height < 10) return false;

    const style = window.getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
      return false;
    }

    const tagName = element.tagName.toLowerCase();
    if (['body', 'html', 'main'].includes(tagName)) {
      return false;
    }

    const screenArea = window.innerWidth * window.innerHeight;
    const elementArea = rect.width * rect.height;
    if (elementArea > screenArea * 0.9) {
      return false;
    }

    return true;
  }, []);

  const findBestElement = useCallback(
    (x: number, y: number): HTMLElement | null => {
      const elements = document.elementsFromPoint(x, y);

      const selectableElements: HTMLElement[] = [];

      for (const element of elements) {
        if (element === overlayRef.current || overlayRef.current?.contains(element)) {
          continue;
        }

        const htmlElement = element as HTMLElement;
        if (isElementSelectable(htmlElement)) {
          selectableElements.push(htmlElement);
        }
      }

      if (selectableElements.length === 0) {
        return null;
      }

      const filteredElements = selectableElements.filter(element => {
        return !selectableElements.some(other => other !== element && element.contains(other));
      });

      return filteredElements.length > 0 ? filteredElements[0] : selectableElements[0];
    },
    [isElementSelectable],
  );

  const createElement = useCallback(
    (element: HTMLElement): SelectedElement => {
      const type = getElementType(element)!;
      const content = getElementContent(element, type);
      const rect = element.getBoundingClientRect();

      return {
        element,
        id: `element-${++elementIdCounter.current}`,
        type,
        content,
        rect: {
          x: rect.x + window.scrollX,
          y: rect.y + window.scrollY,
          width: rect.width,
          height: rect.height,
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          right: rect.right + window.scrollX,
          bottom: rect.bottom + window.scrollY,
        } as DOMRect,
      };
    },
    [getElementContent],
  );

  const findElementsInArea = useCallback(
    (selectionRect: { left: number; right: number; top: number; bottom: number }) => {
      const elementsInArea: SelectedElement[] = [];
      const allElements = document.querySelectorAll('*');

      allElements.forEach(element => {
        if (element === overlayRef.current || overlayRef.current?.contains(element)) {
          return;
        }

        const htmlElement = element as HTMLElement;
        if (!isElementSelectable(htmlElement)) return;

        const rect = htmlElement.getBoundingClientRect();

        const hasOverlap =
          rect.left < selectionRect.right &&
          rect.right > selectionRect.left &&
          rect.top < selectionRect.bottom &&
          rect.bottom > selectionRect.top;

        if (hasOverlap) {
          const overlapLeft = Math.max(rect.left, selectionRect.left);
          const overlapRight = Math.min(rect.right, selectionRect.right);
          const overlapTop = Math.max(rect.top, selectionRect.top);
          const overlapBottom = Math.min(rect.bottom, selectionRect.bottom);

          const overlapArea = (overlapRight - overlapLeft) * (overlapBottom - overlapTop);
          const elementArea = rect.width * rect.height;
          const overlapRatio = overlapArea / elementArea;

          if (overlapRatio > 0.3 || overlapArea > 100) {
            elementsInArea.push(createElement(htmlElement));
          }
        }
      });

      return elementsInArea;
    },
    [createElement, isElementSelectable],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;

      e.preventDefault();
      e.stopPropagation();

      const startX = e.clientX;
      const startY = e.clientY;

      const clickedElement = findBestElement(startX, startY);

      if (clickedElement) {
        const existingIndex = selectedElements.findIndex(sel => sel.element === clickedElement);

        if (existingIndex >= 0) {
          setSelectedElements(prev => prev.filter((_, index) => index !== existingIndex));
        } else {
          const selectedElement = createElement(clickedElement);
          setSelectedElements(prev => [...prev, selectedElement]);
        }
      }

      setDragSelection({
        startX,
        startY,
        endX: startX,
        endY: startY,
      });
    },
    [findBestElement, selectedElements, createElement],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const currentX = e.clientX;
      const currentY = e.clientY;

      if (dragSelection && !isDragging) {
        const deltaX = Math.abs(currentX - dragSelection.startX);
        const deltaY = Math.abs(currentY - dragSelection.startY);

        if (deltaX > DRAG_THRESHOLD || deltaY > DRAG_THRESHOLD) {
          setIsDragging(true);
        }
      }

      if (isDragging && dragSelection) {
        setDragSelection(prev =>
          prev
            ? {
                ...prev,
                endX: currentX,
                endY: currentY,
              }
            : null,
        );

        const selectionRect = {
          left: Math.min(dragSelection.startX, currentX),
          right: Math.max(dragSelection.startX, currentX),
          top: Math.min(dragSelection.startY, currentY),
          bottom: Math.max(dragSelection.startY, currentY),
        };

        const elementsInArea = findElementsInArea(selectionRect);
        setSelectedElements(elementsInArea);
      } else if (!isDragging) {
        const element = findBestElement(currentX, currentY);
        setHoveredElement(element);
      }
    },
    [isDragging, dragSelection, DRAG_THRESHOLD, findBestElement, findElementsInArea],
  );

  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        e.stopPropagation();

        setIsDragging(false);
        setDragSelection(null);
      } else {
        setDragSelection(null);
      }
    },
    [isDragging],
  );

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isDragging) {
      if (selectedElements.length === 0) {
        onCancel();
      }
    }
  };

  const handleCuboxAction = () => {
    const selectedContent = selectedElements
      .map(selected => {
        return selected.element.outerHTML;
      })
      .join('\n\n');

    const { apiBaseUrl, resourceId, namespaceId } = data;
    chrome.runtime.sendMessage(
      {
        resourceId,
        namespaceId,
        action: 'collect',
        baseUrl: apiBaseUrl,
        pageUrl: document.URL,
        pageTitle: document.title,
        data: `<html><head><title>${document.title}</title></head><body>${selectedContent}</body></html>`,
      },
      response => {
        if (response && response.error) {
          onStatus('error');
          onResult(response.error);
        } else {
          onStatus('done');
          onResult(response.data.resource_id);
        }
        setSelectedElements([]);
        onCancel();
      },
    );
  };

  return (
    <>
      {/* ESC 退出提醒 */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-90 text-white px-3 py-1 rounded text-sm z-[999999] pointer-events-none">
        {t('esc_to_exit')}
      </div>

      {/* 透明全屏事件捕获层 - 无背景 */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[999999]"
        style={{
          cursor: isDragging
            ? 'grabbing'
            : `url("data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'><rect x='2' y='2' width='6' height='1' fill='%23333'/><rect x='2' y='2' width='1' height='6' fill='%23333'/><rect x='16' y='2' width='6' height='1' fill='%23333'/><rect x='21' y='2' width='1' height='6' fill='%23333'/><rect x='2' y='21' width='6' height='1' fill='%23333'/><rect x='2' y='16' width='1' height='6' fill='%23333'/><rect x='16' y='21' width='6' height='1' fill='%23333'/><rect x='21' y='16' width='1' height='6' fill='%23333'/><circle cx='12' cy='12' r='2' fill='%23333'/></svg>") 12 12, crosshair`,
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'all',
          background: 'transparent',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={handleOverlayClick}
        onKeyDown={e => {
          if (e.key === 'Escape') {
            onCancel();
          }
        }}
        tabIndex={-1}
        role="presentation"
      />

      {/* 悬停高亮 */}
      {hoveredElement && !isDragging && (
        <div
          className="absolute border-2 border-blue-400 bg-blue-400 bg-opacity-20 pointer-events-none"
          style={{
            left: hoveredElement.getBoundingClientRect().left + window.scrollX,
            top: hoveredElement.getBoundingClientRect().top + window.scrollY,
            width: hoveredElement.getBoundingClientRect().width,
            height: hoveredElement.getBoundingClientRect().height,
          }}
        />
      )}

      {/* 已选中元素高亮 */}
      {selectedElements.map(selected => (
        <div
          key={selected.id}
          className="absolute border-2 border-green-500 bg-green-500 bg-opacity-20 pointer-events-none"
          style={{
            left: selected.rect.left,
            top: selected.rect.top,
            width: selected.rect.width,
            height: selected.rect.height,
          }}
        />
      ))}

      {/* 拖拽选择框 */}
      {isDragging && dragSelection && (
        <div
          className="absolute border-2 border-purple-500 bg-purple-500 bg-opacity-10 pointer-events-none"
          style={{
            left: Math.min(dragSelection.startX, dragSelection.endX),
            top: Math.min(dragSelection.startY, dragSelection.endY),
            width: Math.abs(dragSelection.endX - dragSelection.startX),
            height: Math.abs(dragSelection.endY - dragSelection.startY),
          }}
        />
      )}

      {/* Cubox风格的简洁操作按钮 */}
      {selectedElements.length > 0 && (
        <div
          className="fixed z-[1000000]"
          style={{
            left: Math.max(
              20,
              Math.min(
                selectedElements[0].rect.left + selectedElements[0].rect.width / 2 - 60,
                window.innerWidth - 140,
              ),
            ),
            top: selectedElements[0].rect.top - 50,
          }}>
          <Button
            variant="default"
            onClick={handleCuboxAction}
            className="w-full flex h-[38px] items-center rounded-[8px] mt-[20px]">
            <BoxIcon />
            <span>{t('save_to_omnibox')}</span>
          </Button>
        </div>
      )}
    </>
  );
}

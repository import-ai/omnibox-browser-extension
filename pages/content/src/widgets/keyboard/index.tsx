import { useEffect, useRef } from 'react';
import type { Storage } from '@extension/shared';
import { useAction } from '@src/provider/useAction';
import { parseKeyboardEvent, createShortcut } from '@extension/shared';

interface IProps {
  data: Storage;
}

export function KeyboardHandler(props: IProps) {
  const { data } = props;
  const { onPopup, onResult, onStatus } = useAction();
  const handledRef = useRef(false);
  const shortcuts = data.keyboardShortcuts;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent handling keyboard events on input elements
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
        return;
      }

      const { modifierKeys, mainKey } = parseKeyboardEvent(e);
      if (!mainKey) return;

      const { raw } = createShortcut(modifierKeys, mainKey);

      if (!shortcuts) return;

      // Handle activation shortcut (popup)
      if (shortcuts.activation && raw === shortcuts.activation) {
        e.preventDefault();
        e.stopPropagation();

        if (!handledRef.current) {
          handledRef.current = true;
          onPopup(val => !val);
          setTimeout(() => {
            handledRef.current = false;
          }, 100);
        }
        return;
      }

      // Handle save shortcut
      if (shortcuts.save && raw === shortcuts.save) {
        e.preventDefault();
        e.stopPropagation();

        if (!handledRef.current) {
          handledRef.current = true;
          const { apiBaseUrl, resourceId, namespaceId } = data;
          chrome.runtime.sendMessage(
            {
              resourceId,
              namespaceId,
              action: 'collect',
              baseUrl: apiBaseUrl,
              pageUrl: document.URL,
              pageTitle: document.title,
              data: document.documentElement.outerHTML,
            },
            response => {
              if (response && response.error) {
                onStatus('error');
                onResult(response.error);
              } else {
                onStatus('done');
                onResult(response.data.resource_id);
              }
              handledRef.current = false;
            },
          );
        }
      }
    };

    // Only add event listener if keyboard shortcuts are enabled and configured
    const hasShortcuts = shortcuts && (shortcuts.activation || shortcuts.save);

    if (hasShortcuts) {
      document.addEventListener('keydown', handleKeyDown, true);
    }

    return () => {
      if (hasShortcuts) {
        document.removeEventListener('keydown', handleKeyDown, true);
      }
    };
  }, [data, onPopup, onResult, onStatus, shortcuts]);

  return null;
}

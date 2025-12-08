import zIndex from '@src/utils/zindex';
import { Progress } from '@extension/ui';
import { useTranslation } from 'react-i18next';
import type { Storage } from '@extension/shared';
import { useAction } from '@src/provider/useAction';
import { useCallback, useEffect, useRef, useState } from 'react';
import { parseKeyboardEvent, createShortcut } from '@extension/shared';

interface IProps {
  data: Storage;
}

export function KeyboardHandler(props: IProps) {
  const { data } = props;
  const { t } = useTranslation();
  const [progress, onProgress] = useState(0);
  const { onPopup, onResult, onStatus } = useAction();
  const handledRef = useRef(false);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const shortcuts = data.keyboardShortcuts;

  const startFakeProgress = useCallback(() => {
    onProgress(5); // Start with 5%

    const updateProgress = () => {
      onProgress(currentProgress => {
        if (currentProgress >= 95) {
          // Very slow near the end
          return Math.min(98, currentProgress + 0.5);
        } else if (currentProgress >= 80) {
          // Slower as approaching 100%
          return currentProgress + 1;
        } else if (currentProgress >= 60) {
          // Medium speed
          return currentProgress + 2;
        } else {
          // Faster at the beginning
          return currentProgress + 3;
        }
      });
    };

    // Start the interval
    progressIntervalRef.current = setInterval(updateProgress, 200);
  }, [onProgress]);

  const stopFakeProgress = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const completeProgress = useCallback(() => {
    stopFakeProgress();
    onProgress(100);
    // Reset after showing 100% briefly
    setTimeout(() => {
      onProgress(0);
    }, 500);
  }, [stopFakeProgress, onProgress]);

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
          startFakeProgress();
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
              completeProgress();
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
      stopFakeProgress();
    };
  }, [data, onPopup, onResult, onStatus, shortcuts, startFakeProgress, completeProgress, stopFakeProgress]);

  if (progress <= 0) {
    return null;
  }

  return (
    <div
      className={`fixed left-[50%] ml-[-130px] overflow-hidden top-[50px] rounded-[8px] min-w-[180px] bg-background text-foreground`}
      style={{
        zIndex: zIndex(),
      }}>
      <div className="flex items-center gap-[12px] px-[12px] py-[14px]">
        <div className="size-[20px]">
          <img src={chrome.runtime.getURL('icon-128.png')} alt="logo" />
        </div>
        <span className="text-sm font-[600] text-white">{t('saving')}</span>
      </div>
      <Progress value={progress} className="h-[3px] absolute bottom-0 left-0 w-full" />
    </div>
  );
}

import { useState, useEffect } from 'react';
import { SectionSelector } from './SectionSelector';
import { parseKeyboardEvent, createShortcut } from '@extension/shared';
import type { Storage } from '@extension/shared';

export interface IProps {
  data: Storage;
}

export function SectionContainer(props: IProps) {
  const { data } = props;
  const [selecting, setSelecting] = useState(false);
  const handleCancel = () => {
    setSelecting(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selecting) {
        return;
      }

      // Prevent handling keyboard events on input elements
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
        return;
      }

      const { modifierKeys, mainKey } = parseKeyboardEvent(e);

      const shortcuts = data.keyboardShortcuts;
      if (!shortcuts || !shortcuts.saveSection) {
        return;
      }

      // Only handle if we have a complete shortcut match
      if (mainKey) {
        const { raw } = createShortcut(modifierKeys, mainKey);
        if (raw === shortcuts.saveSection && !selecting) {
          e.preventDefault();
          setSelecting(true);
          return;
        }
      } else if (e.key === 'Alt' && modifierKeys.length === 1 && modifierKeys[0] === 'Alt') {
        // Only trigger on single Alt if the configured shortcut is exactly 'Alt'
        if (shortcuts.saveSection === 'Alt' && !selecting) {
          e.preventDefault();
          setSelecting(true);
          return;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selecting, data.keyboardShortcuts]);

  if (!selecting) {
    return null;
  }

  return <SectionSelector data={data} onCancel={handleCancel} />;
}

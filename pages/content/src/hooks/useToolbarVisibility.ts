import { useState, useEffect } from 'react';

interface Position {
  x: number;
  y: number;
}

export function useToolbarVisibility(isPopupVisible: boolean = false) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

  useEffect(() => {
    const checkSelection = () => {
      const selection = window.getSelection();
      const selectedText = selection?.toString().trim();
      return !!selectedText && selectedText.length > 0;
    };

    const handleMouseUp = (event: MouseEvent) => {
      // Show toolbar only when mouse is released and text is selected
      if (checkSelection()) {
        // Don't show toolbar if popup is visible
        if (isPopupVisible) {
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
        setIsVisible(true);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      // Handle keyboard text selection (Shift + Arrow keys, etc.)
      if (event.shiftKey || event.key === 'Shift') {
        if (checkSelection()) {
          // Don't show toolbar if popup is visible
          if (isPopupVisible) {
            return;
          }
          // For keyboard selection, position at center of current viewport (including scroll)
          const x = window.scrollX + window.innerWidth / 2;
          const y = window.scrollY + window.innerHeight / 3;
          setPosition({ x, y });
          setIsVisible(true);
        }
      }
    };

    const handleSelectionChange = () => {
      // Hide toolbar when selection is cleared
      if (!checkSelection()) {
        setIsVisible(false);
      }
    };

    // Listen for mouse release after selection
    document.addEventListener('mouseup', handleMouseUp);

    // Listen for keyboard selection completion
    document.addEventListener('keyup', handleKeyUp);

    // Listen for selection changes to detect when selection is cleared
    document.addEventListener('selectionchange', handleSelectionChange);

    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [isPopupVisible]);

  return { isVisible, setIsVisible, position };
}

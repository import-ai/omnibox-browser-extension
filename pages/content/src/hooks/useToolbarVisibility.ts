import { useState, useEffect } from 'react';

export function useToolbarVisibility() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkSelection = () => {
      const selection = window.getSelection();
      const selectedText = selection?.toString().trim();
      return !!selectedText && selectedText.length > 0;
    };

    const handleMouseUp = () => {
      // Show toolbar only when mouse is released and text is selected
      if (checkSelection()) {
        setIsVisible(true);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      // Handle keyboard text selection (Shift + Arrow keys, etc.)
      if (event.shiftKey || event.key === 'Shift') {
        if (checkSelection()) {
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
  }, []);

  return { isVisible, setIsVisible };
}

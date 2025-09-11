import { Input } from '@extension/ui';
import { useState, useEffect, useRef } from 'react';
import { parseShortcutToDisplay, parseKeyboardEvent, createShortcut } from '@extension/shared';

interface ShortcutInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function ShortcutInput({ value, onChange, placeholder = '输入快捷键', className }: ShortcutInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const [displayValue, setDisplayValue] = useState(parseShortcutToDisplay(value));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditing) {
      setCurrentValue(value);
      setDisplayValue(parseShortcutToDisplay(value));
    }
  }, [value, isEditing]);

  const handleFocus = () => {
    setIsEditing(true);
    setDisplayValue('');
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (!currentValue.trim()) {
      setCurrentValue('');
      setDisplayValue('');
      onChange('');
    } else {
      setDisplayValue(parseShortcutToDisplay(currentValue));
      onChange(currentValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const { modifierKeys, mainKey } = parseKeyboardEvent(e);

    // Only create shortcut if we have a main key
    if (mainKey) {
      const { raw, display } = createShortcut(modifierKeys, mainKey);
      setCurrentValue(raw);
      setDisplayValue(display);
    }
  };

  return (
    <Input
      ref={inputRef}
      className={className}
      value={displayValue}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      placeholder={isEditing ? placeholder : displayValue || placeholder}
      readOnly={false}
    />
  );
}

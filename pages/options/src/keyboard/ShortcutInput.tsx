import { Input, Kbd, KbdGroup } from '@extension/ui';
import React, { useState, useEffect, useRef } from 'react';
import { parseShortcutToDisplay, parseKeyboardEvent, createShortcut } from '@extension/shared';
import { useTranslation } from 'react-i18next';

interface ShortcutInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function ShortcutInput({ value, onChange, placeholder, className }: ShortcutInputProps) {
  const { t } = useTranslation();
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
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
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

    // Handle single Alt key as a valid shortcut
    if (e.key === 'Alt' && !mainKey && modifierKeys.length === 1 && modifierKeys[0] === 'Alt') {
      const { raw, display } = createShortcut([], 'Alt');
      setCurrentValue(raw);
      setDisplayValue(display);
      return;
    }

    // Only create shortcut if we have a main key
    if (mainKey) {
      const { raw, display } = createShortcut(modifierKeys, mainKey);
      setCurrentValue(raw);
      setDisplayValue(display);
    }
  };

  if (!isEditing) {
    return (
      <div className="h-[36px] w-[200px] flex justify-end items-center">
        <KbdGroup onClick={handleFocus}>
          {displayValue.split('+').map((val, index) => (
            <React.Fragment key={val}>
              {index > 0 && <span className="opacity-50">+</span>}
              <Kbd>{val}</Kbd>
            </React.Fragment>
          ))}
        </KbdGroup>
      </div>
    );
  }

  return (
    <Input
      ref={inputRef}
      className={className}
      value={displayValue}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      placeholder={
        isEditing ? placeholder || t('shortcut_placeholder') : displayValue || placeholder || t('shortcut_placeholder')
      }
      readOnly={false}
    />
  );
}

import { Input, Kbd, KbdGroup } from '@extension/ui';
import React, { useState, useEffect, useRef } from 'react';
import { parseShortcutToDisplay, parseKeyboardEvent, createShortcut } from '@extension/shared';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';

interface ShortcutInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function ShortcutInput({ value, onChange, placeholder, className }: ShortcutInputProps) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
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

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentValue('');
    setDisplayValue('');
    onChange('');
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleFocus();
    }
  };

  if (!isEditing) {
    return (
      <div
        role="button"
        tabIndex={0}
        className="flex h-9 w-[200px] items-center rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors hover:bg-accent/50 cursor-text md:text-sm dark:bg-background"
        onClick={handleFocus}
        onKeyDown={handleKeyPress}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}>
        {displayValue ? (
          <>
            <KbdGroup className="flex-1">
              {displayValue.split('+').map((val, index) => (
                <React.Fragment key={val}>
                  {index > 0 && <span className="opacity-50">+</span>}
                  <Kbd>{val}</Kbd>
                </React.Fragment>
              ))}
            </KbdGroup>
            {isHovered && (
              <button
                onClick={handleClear}
                className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-muted text-muted-foreground hover:bg-muted-foreground/20 hover:text-foreground transition-colors cursor-pointer">
                <X className="h-3 w-3" />
              </button>
            )}
          </>
        ) : (
          <span className="text-muted-foreground">{t('shortcut_click_to_set')}</span>
        )}
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
      placeholder={placeholder || t('shortcut_press_keys')}
      readOnly={false}
    />
  );
}

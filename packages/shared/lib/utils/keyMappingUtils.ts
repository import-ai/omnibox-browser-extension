type ModifierKey = 'Control' | 'Meta' | 'Alt' | 'Shift';
type SpecialKey =
  | 'ArrowUp'
  | 'ArrowDown'
  | 'ArrowLeft'
  | 'ArrowRight'
  | 'Enter'
  | 'Escape'
  | 'Tab'
  | 'Backspace'
  | 'Delete'
  | 'Space';
type FunctionKey = 'F1' | 'F2' | 'F3' | 'F4' | 'F5' | 'F6' | 'F7' | 'F8' | 'F9' | 'F10' | 'F11' | 'F12';
type KnownKey = ModifierKey | SpecialKey | FunctionKey;

export type { ModifierKey, SpecialKey, FunctionKey, KnownKey };

export const KEY_SYMBOLS: Record<KnownKey, string> = {
  // Modifier keys
  Control: '⌃',
  Meta: '⌘',
  Alt: '⌥',
  Shift: '⇧',

  // Special keys
  ArrowUp: '↑',
  ArrowDown: '↓',
  ArrowLeft: '←',
  ArrowRight: '→',
  Enter: '↩',
  Escape: '⎋',
  Tab: '⇥',
  Backspace: '⌫',
  Delete: '⌦',
  Space: '␣',

  // Function keys
  F1: 'F1',
  F2: 'F2',
  F3: 'F3',
  F4: 'F4',
  F5: 'F5',
  F6: 'F6',
  F7: 'F7',
  F8: 'F8',
  F9: 'F9',
  F10: 'F10',
  F11: 'F11',
  F12: 'F12',
};

export const getKeySymbol = (key: string): string => {
  return KEY_SYMBOLS[key as KnownKey] || (key.length === 1 ? key.toUpperCase() : key);
};

export const formatShortcut = (keys: string[]): string => {
  return keys.map(getKeySymbol).join('+');
};

export const parseShortcutToDisplay = (shortcut: string): string => {
  if (!shortcut) return '';
  const keys = shortcut.split('+');
  return formatShortcut(keys);
};

export const parseKeyboardEvent = (
  e: KeyboardEvent | React.KeyboardEvent,
): { modifierKeys: ModifierKey[]; mainKey: string | null } => {
  const modifierKeys: ModifierKey[] = [];
  let mainKey: string | null = null;

  // Collect modifier keys
  if (e.ctrlKey || e.metaKey) {
    modifierKeys.push(e.metaKey ? 'Meta' : 'Control');
  }
  if (e.altKey) {
    modifierKeys.push('Alt');
  }
  if (e.shiftKey) {
    modifierKeys.push('Shift');
  }

  // Use code for physical key detection
  const excludedCodes = [
    'ControlLeft',
    'ControlRight',
    'AltLeft',
    'AltRight',
    'ShiftLeft',
    'ShiftRight',
    'MetaLeft',
    'MetaRight',
  ];

  if (!excludedCodes.includes(e.code)) {
    if (e.code.startsWith('Key')) {
      mainKey = e.code.slice(3); // KeyT -> T
    } else if (e.code === 'Space') {
      mainKey = 'Space';
    } else {
      mainKey = e.key;
    }
  }

  return { modifierKeys, mainKey };
};

export const createShortcut = (modifierKeys: ModifierKey[], mainKey: string): { raw: string; display: string } => {
  const allKeys = [...modifierKeys, mainKey];
  const raw = allKeys.join('+');
  const display = formatShortcut(allKeys);
  return { raw, display };
};

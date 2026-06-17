import { Save } from './Save';
import { Section } from './Section';
import { Activation } from './Activation';
import { Separator } from '@extension/ui';
import type { IProps } from '@src/types';
import type { Storage } from '@extension/shared';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

type ShortcutKey = keyof NonNullable<Storage['keyboardShortcuts']>;

const shortcutFields: ShortcutKey[] = ['saveSection', 'activation', 'save'];

const isDuplicateShortcut = (shortcuts: Storage['keyboardShortcuts'], currentKey: ShortcutKey, value: string) => {
  const shortcut = value.trim();

  if (!shortcut) {
    return false;
  }

  return shortcutFields.some(key => key !== currentKey && shortcuts?.[key] === shortcut);
};

export function Keyboard(props: IProps) {
  const { data, onChange } = props;
  const { t } = useTranslation();

  const handleShortcutChange = (key: ShortcutKey, value: string) => {
    if (isDuplicateShortcut(data.keyboardShortcuts, key, value)) {
      toast(t('shortcut_duplicate_error'), { position: 'bottom-right' });
      return false;
    }

    onChange(
      {
        ...data.keyboardShortcuts,
        [key]: value,
      },
      'keyboardShortcuts',
    );
    return true;
  };

  const createShortcutProps = (key: ShortcutKey) => ({
    ...props,
    onShortcutChange: (value: string) => handleShortcutChange(key, value),
  });

  return (
    <>
      <Section {...createShortcutProps('saveSection')} />
      <Separator className="my-[24px] bg-[#F2F2F2] dark:bg-background" />
      <Activation {...createShortcutProps('activation')} />
      <Separator className="my-[24px] bg-[#F2F2F2] dark:bg-background" />
      <Save {...createShortcutProps('save')} />
    </>
  );
}

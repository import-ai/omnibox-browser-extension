import { Switch } from '@extension/ui';
import type { IProps } from '@src/types';
import { useTranslation } from 'react-i18next';

export function Audio(props: IProps) {
  const { data, onChange } = props;
  const { t } = useTranslation();
  const handleAudioToggle = (checked: boolean) => {
    onChange(checked, 'audioEnabled');
  };

  return (
    <div className="flex items-center justify-between">
      <span className="font-[500]">{t('audio_effects')}</span>
      <Switch className="scale-[0.8]" checked={!!data.audioEnabled} onCheckedChange={handleAudioToggle} />
    </div>
  );
}

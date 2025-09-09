import { EditIcon } from '../icon/edit';
import { useTranslation } from 'react-i18next';
import { Switch } from '@extension/ui';
import type { IProps } from '@src/types';

export function SectionText(props: IProps) {
  const { baseUrl } = props;
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-[8px]">
        <EditIcon />
        <span className="font-[500]">划线菜单</span>
      </div>
      <Switch className="scale-[0.8]" />
    </div>
  );
}

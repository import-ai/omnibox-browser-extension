import { t } from '@extension/i18n';
import type { Language } from '@extension/shared';
import { Check, ChevronDown, Earth } from 'lucide-react';
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@extension/ui';

interface IProps {
  data: Language;
  onChange: (val: string | { [index: string]: string }, key?: string) => void;
}

export default function FieldLanguage(props: IProps) {
  const { data, onChange } = props;
  const dataSource = [
    { label: '简体中文', value: 'zh-CN' },
    { label: 'English', value: 'en-US' },
  ];

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Earth className="size-5" />
        <span>{t('language')}</span>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="font-normal w-36 justify-between">
            <span>{dataSource.find(item => item.value === data)?.label}</span>
            <ChevronDown className="size-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {dataSource.map(item => (
            <DropdownMenuItem
              key={item.value}
              className="flex justify-between"
              onClick={() => onChange(item.value, 'language')}>
              {item.label}
              {item.value === data && <Check className="size-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

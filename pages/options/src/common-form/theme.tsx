import { t } from '@extension/i18n';
import type { Theme } from '@extension/shared';
import { Check, PanelTop, ChevronDown } from 'lucide-react';
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@extension/ui';

interface IProps {
  data: Theme;
  onChange: (val: string | { [index: string]: string }, key?: string) => void;
}

export default function FieldTheme(props: IProps) {
  const { data, onChange } = props;
  const dataSource: Array<{
    label: string;
    value: 'light' | 'system' | 'dark';
  }> = [
    { label: t('light'), value: 'light' },
    { label: t('dark'), value: 'dark' },
    { label: t('system'), value: 'system' },
  ];

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <PanelTop className="size-5" />
        <span>{t('appearance')}</span>
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
              onClick={() => onChange(item.value, 'theme')}>
              {item.label}
              {item.value === data && <Check className="size-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

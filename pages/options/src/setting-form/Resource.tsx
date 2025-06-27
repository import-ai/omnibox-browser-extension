import { useState } from 'react';
import { t } from '@extension/i18n';
import { Check, ChevronDown, FolderClosed } from 'lucide-react';
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@extension/ui';

export default function Resource() {
  const [theme, onToggleTheme] = useState('light');
  const data: Array<{
    label: string;
    value: 'light' | 'system' | 'dark';
  }> = [
    { label: t('light'), value: 'light' },
    { label: t('dark'), value: 'dark' },
    { label: t('system'), value: 'system' },
  ];

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <FolderClosed className="size-4" />
        <span className="text-sm">默认收藏至</span>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="font-normal w-48 justify-between">
            {data.find(item => item.value === theme)?.label}
            <ChevronDown className="size-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {data.map(item => (
            <DropdownMenuItem
              key={item.value}
              className="flex justify-between"
              onClick={() => onToggleTheme(item.value)}>
              {item.label}
              {item.value === theme && <Check className="size-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

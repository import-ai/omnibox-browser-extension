import { t } from '@extension/i18n';
import { Check, ChevronDown, Earth } from 'lucide-react';
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@extension/ui';

export default function Language() {
  const data = [
    { label: '简体中文', value: 'zh' },
    { label: 'English', value: 'en' },
  ];
  const handleLanguageChange = (lang: string) => {
    console.log(lang);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Earth className="size-5" />
        <span>{t('language')}</span>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="font-normal w-36 justify-between">
            {data.find(item => item.value === 'zh')?.label}
            <ChevronDown className="size-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {data.map(item => (
            <DropdownMenuItem
              key={item.value}
              className="flex justify-between"
              onClick={() => handleLanguageChange(item.value)}>
              {item.label}
              {item.value === 'zh' && <Check className="size-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

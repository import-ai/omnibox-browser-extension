import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { Language } from '@extension/shared';
import axios from '@extension/shared/lib/utils/axios';
import { Check, ChevronDown, Earth } from 'lucide-react';
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@extension/ui';

interface IProps {
  baseUrl: string;
  data: Language;
  onChange: (val: string | { [index: string]: string }, key?: string) => void;
}

export default function FieldLanguage(props: IProps) {
  const { baseUrl, data, onChange } = props;
  const { i18n, t } = useTranslation();
  const dataSource = [
    { label: '简体中文', value: 'zh' },
    { label: 'English', value: 'en' },
  ];
  const toggleLanguage = (lng: string) => {
    i18n.changeLanguage(lng).then(() => {
      if (!baseUrl) {
        onChange(lng, 'language');
        return;
      }
      axios(`${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}/api/v1/user/option`, {
        data: {
          name: 'language',
          value: lng === 'en' ? 'en-US' : 'zh-CN',
        },
      }).then(() => {
        onChange(lng, 'language');
      });
    });
  };

  useEffect(() => {
    if (!baseUrl) {
      return;
    }
    axios(`${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}/api/v1/user/option/language`).then(response => {
      if (!response || !response.value) {
        return;
      }
      const lng = response.value === 'en-US' ? 'en' : 'zh';
      if (lng !== i18n.language) {
        i18n.changeLanguage(lng).then(() => {
          onChange(lng, 'language');
        });
      }
    });
  }, [i18n, baseUrl, onChange]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Earth className="size-4" />
        <span>{t('language')}</span>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="font-normal w-40 justify-between">
            <span>{dataSource.find(item => item.value === data)?.label}</span>
            <ChevronDown className="size-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {dataSource.map(item => (
            <DropdownMenuItem
              key={item.value}
              className="flex justify-between"
              onClick={() => toggleLanguage(item.value)}>
              {item.label}
              {item.value === data && <Check className="size-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

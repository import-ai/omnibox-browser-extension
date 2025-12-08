import { useEffect } from 'react';
import { axios } from '@extension/shared';
import { useTranslation } from 'react-i18next';
import type { Language } from '@extension/shared';
import { Check, ChevronDown } from 'lucide-react';
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@extension/ui';

interface IProps {
  baseUrl: string;
  data: Language;
  loading: boolean;
  onChange: (val: string | { [index: string]: string }, key?: string) => void;
}

export default function FieldLanguage(props: IProps) {
  const { baseUrl, loading, data, onChange } = props;
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
    if (loading || !baseUrl) {
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
  }, [i18n, baseUrl, loading, onChange]);

  return (
    <div className="flex items-center justify-between">
      <span className="font-[500]">{t('language')}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="font-normal w-[200px] justify-between">
            <span>{dataSource.find(item => item.value === data)?.label}</span>
            <ChevronDown className="size-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px] dark:border-neutral-800">
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

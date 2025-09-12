import { useEffect } from 'react';
import type { Theme } from '@extension/shared';
import { useTranslation } from 'react-i18next';
import { axios } from '@extension/shared/lib/utils/axios';
import { Check, ChevronDown } from 'lucide-react';
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@extension/ui';

interface IProps {
  baseUrl: string;
  data: Theme;
  loading: boolean;
  onChange: (val: string | { [index: string]: string }, key?: string) => void;
}

export default function FieldTheme(props: IProps) {
  const { baseUrl, loading, data, onChange } = props;
  const { t } = useTranslation();
  const dataSource: Array<{
    label: string;
    value: 'light' | 'system' | 'dark';
  }> = [
    { label: t('light'), value: 'light' },
    { label: t('dark'), value: 'dark' },
    { label: t('system'), value: 'system' },
  ];
  const handleTheme = (theme: Theme) => {
    if (!baseUrl) {
      onChange(theme, 'theme');
      return;
    }
    axios(`${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}/api/v1/user/option`, {
      data: {
        name: 'theme',
        value: theme,
      },
    }).then(() => {
      onChange(theme, 'theme');
    });
  };

  useEffect(() => {
    if (loading || !data || !baseUrl) {
      return;
    }
    axios(`${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}/api/v1/user/option/theme`).then(response => {
      if (!response || !response.value) {
        return;
      }
      if (response.value !== data) {
        onChange(response.value, 'theme');
      }
    });
  }, [data, baseUrl, loading, onChange]);

  return (
    <div className="flex items-center justify-between">
      <span className="font-[500]">{t('appearance')}</span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="font-normal w-[200px] justify-between">
            <span>{dataSource.find(item => item.value === data)?.label}</span>
            <ChevronDown className="size-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {dataSource.map(item => (
            <DropdownMenuItem key={item.value} className="flex justify-between" onClick={() => handleTheme(item.value)}>
              {item.label}
              {item.value === data && <Check className="size-4" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

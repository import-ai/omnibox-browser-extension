import { useEffect } from 'react';
import type { Theme } from '@extension/shared';
import { useTranslation } from 'react-i18next';
import axios from '@extension/shared/lib/utils/axios';
import { Check, PanelTop, ChevronDown } from 'lucide-react';
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@extension/ui';

interface IProps {
  apiKey: string;
  baseUrl: string;
  data: Theme;
  onChange: (val: string | { [index: string]: string }, key?: string) => void;
}

export default function FieldTheme(props: IProps) {
  const { apiKey, baseUrl, data, onChange } = props;
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
    if (!baseUrl || !apiKey) {
      onChange(theme, 'theme');
      return;
    }
    axios(`${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}/api/v1/user/option`, {
      apiKey,
      data: {
        name: 'theme',
        value: theme,
      },
    }).then(() => {
      onChange(theme, 'theme');
    });
  };

  useEffect(() => {
    if (!data || !baseUrl || !apiKey) {
      return;
    }
    axios(`${baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl}/api/v1/user/option/theme`, { apiKey }).then(
      response => {
        if (!response || !response.value) {
          return;
        }
        if (response.value !== data) {
          onChange(response.value, 'theme');
        }
      },
    );
  }, [data, baseUrl, apiKey, onChange]);

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <PanelTop className="size-4" />
        <span>{t('appearance')}</span>
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

import { Card } from './Card';
import { useEffect } from 'react';
import { Common } from './common';
import { Wrapper } from './Wrapper';
import { Advance } from './advance';
import { Toolbar } from './toolbar';
import { Keyboard } from './keyboard';
import { useOption } from '@extension/shared';
import { useTranslation } from 'react-i18next';

export default function Page() {
  const { t } = useTranslation();
  const { data, loading, onChange, refetch } = useOption();

  useEffect(() => {
    let state = data.theme;
    if (data.theme === 'system') {
      state = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(state);
  }, [data.theme]);

  return (
    <Wrapper refetch={refetch} namespaceId={data.namespaceId} baseUrl={loading ? '' : data.apiBaseUrl}>
      <Card title={t('common')}>
        <Common loading={loading} data={data} onChange={onChange} />
      </Card>
      <Card title={t('toolbar_settings')}>
        <Toolbar loading={loading} data={data} onChange={onChange} refetch={refetch} />
      </Card>
      <Card title={t('keyboard_settings')}>
        <Keyboard loading={loading} data={data} onChange={onChange} refetch={refetch} />
      </Card>
      <Card title={t('setting')}>
        <Advance loading={loading} data={data} onChange={onChange} refetch={refetch} />
      </Card>
    </Wrapper>
  );
}

import { Card } from './Card';
import { useEffect } from 'react';
import { Common } from './common';
import { Wrapper } from './Wrapper';
import { Advance } from './advance';
import { Toolbar } from './toolbar';
import { Keyboard } from './keyboard';
import { initResources } from './utils';
import { useOption } from '@extension/shared';
import { useTranslation } from 'react-i18next';

export default function Page() {
  const { data, onChange, refetch } = useOption();
  const { t } = useTranslation();

  useEffect(() => {
    let state = data.theme;
    if (data.theme === 'system') {
      state = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(state);
  }, [data.theme]);

  useEffect(() => {
    const focusFN = () => {
      initResources(refetch);
    };
    window.addEventListener('focus', focusFN);
    return () => {
      window.removeEventListener('focus', focusFN);
    };
  }, [refetch]);

  return (
    <Wrapper>
      <Card title={t('common')}>
        <Common data={data} onChange={onChange} />
      </Card>
      <Card title="工具栏设置">
        <Toolbar data={data} onChange={onChange} refetch={refetch} />
      </Card>
      <Card title="快捷键设置">
        <Keyboard data={data} onChange={onChange} refetch={refetch} />
      </Card>
      <Card title={t('setting')}>
        <Advance data={data} onChange={onChange} refetch={refetch} />
      </Card>
    </Wrapper>
  );
}

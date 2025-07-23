import Wrapper from './Wrapper';
import { useEffect } from 'react';
import useApp from './hooks/useApp';
import { useOption } from '@extension/shared';
import { useTranslation } from 'react-i18next';

export default function Page() {
  const { i18n } = useTranslation();
  const { data } = useOption();
  const { container } = useApp();

  useEffect(() => {
    let state = data.theme;
    if (data.theme === 'system') {
      state = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    container.classList.remove('light', 'dark');
    container.classList.add(state);
  }, [container, data.theme]);

  useEffect(() => {
    if (data.language !== i18n.language) {
      i18n.changeLanguage(data.language);
    }
  }, [i18n, data.language]);

  return <Wrapper {...data} />;
}

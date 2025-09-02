import { useEffect } from 'react';
import useApp from '@src/hooks/useApp';
import { useOption } from '@extension/shared';
import { useTranslation } from 'react-i18next';
import { PopupContainer } from '@src/widgets/popup';
import { FeedbackContainer } from '@src/widgets/feedback';

export default function Page() {
  const { data } = useOption();
  const { container } = useApp();
  const { i18n } = useTranslation();

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

  return (
    <>
      <PopupContainer />
      <FeedbackContainer />
    </>
  );
}

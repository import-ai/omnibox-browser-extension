import { useEffect } from 'react';
import { Provider } from './provider';
import useApp from '@src/hooks/useApp';
import { useTranslation } from 'react-i18next';
import { useOption } from '@src/hooks/useOption';
import { PopupContainer } from '@src/widgets/popup';
import { ToolbarContainer } from '@src/widgets/toolbar';
import { FeedbackContainer } from '@src/widgets/feedback';
import { SectionContainer } from '@src/widgets/section';
import { KeyboardHandler } from '@src/widgets/keyboard';

export default function Page() {
  const { shadow, container } = useApp();
  const { i18n } = useTranslation();
  const { data, loading, refetch, onChange } = useOption();

  useEffect(() => {
    document.head.querySelectorAll('style').forEach(styleEl => {
      if (styleEl.textContent?.includes('[data-sonner-toaster]')) {
        const toastStyleElement = document.createElement('style');
        toastStyleElement.type = 'text/css';
        toastStyleElement.innerText = styleEl.textContent;
        shadow.append(toastStyleElement);
      }
    });
  }, [shadow]);

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
    <Provider>
      <PopupContainer data={data} loading={loading} refetch={refetch} onChange={onChange} />
      <ToolbarContainer data={data} onChange={onChange} />
      <FeedbackContainer data={data} />
      {data.sectionEnabled && <SectionContainer data={data} />}
      <KeyboardHandler data={data} />
    </Provider>
  );
}

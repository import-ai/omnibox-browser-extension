import Header from './Header';
import { Auth } from './Auth';
import { MainContent } from './MainContent';
import { Wrapper } from './Wrapper';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { track, useOption } from '@extension/shared';

interface PopupContainerProps {
  isVisible: boolean;
}

export function PopupContainer({ isVisible }: PopupContainerProps) {
  const { i18n } = useTranslation();
  const { data, refetch } = useOption();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    track('open_chrome_popup', {
      once: true,
      section: 'ext_popup',
    });
  }, []);

  useEffect(() => {
    chrome.runtime.sendMessage({ action: 'check-token', baseUrl: data.apiBaseUrl }, response => {
      setIsAuthenticated(response?.hasToken || false);
    });
  }, [data.apiBaseUrl]);

  useEffect(() => {
    let state = data.theme;
    if (data.theme === 'system') {
      state = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(state);
  }, [data.theme]);

  useEffect(() => {
    if (data.language !== i18n.language) {
      i18n.changeLanguage(data.language);
    }
  }, [i18n, data.language]);

  if (isAuthenticated === null) {
    return (
      <Wrapper isVisible={isVisible}>
        <Header />
        <div className="p-4 text-center text-sm text-gray-500">检查登录状态...</div>
      </Wrapper>
    );
  }

  return (
    <Wrapper isVisible={isVisible}>
      <Header />
      {isAuthenticated ? <MainContent /> : <Auth baseUrl={data.apiBaseUrl} />}
    </Wrapper>
  );
}

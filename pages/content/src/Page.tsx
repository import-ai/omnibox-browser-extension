import { useEffect } from 'react';
import useApp from '@src/hooks/useApp';
import { useOption } from '@extension/shared';
import { useTranslation } from 'react-i18next';
import { usePopupVisibility } from '@src/hooks/usePopupVisibility';
import { useToolbarVisibility } from '@src/hooks/useToolbarVisibility';
import { useNotificationVisibility } from '@src/hooks/useNotificationVisibility';
import { PopupContainer } from '@src/widgets/popup';
import { ToolbarContainer } from '@src/widgets/toolbar';
import { NotificationContainer } from '@src/widgets/notification';

export default function Page() {
  const { data } = useOption();
  const { container } = useApp();
  const { i18n } = useTranslation();
  const { isVisible: isPopupVisible } = usePopupVisibility();
  const { isVisible: isToolbarVisible, position: toolbarPosition } = useToolbarVisibility(isPopupVisible);
  const { isVisible: isNotificationVisible, notificationData } = useNotificationVisibility();

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
      <PopupContainer isVisible={isPopupVisible} />
      <ToolbarContainer isVisible={isToolbarVisible} position={toolbarPosition} />
      <NotificationContainer isVisible={isNotificationVisible} data={notificationData} />
    </>
  );
}

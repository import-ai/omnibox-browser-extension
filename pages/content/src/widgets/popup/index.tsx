// import { toast } from 'sonner';
import Header from './Header';
import { Auth } from './Auth';
// import { Save } from './save';
// import Collect from './Collect';
import { Wrapper } from './Wrapper';
// import { Section } from './Section';
// import { SectionText } from './SelectionText';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { track, useOption } from '@extension/shared';

interface PopupContainerProps {
  isVisible: boolean;
}

export function PopupContainer({ isVisible }: PopupContainerProps) {
  const { i18n } = useTranslation();
  const { data, refetch } = useOption();
  // const [collecting, setCollecting] = useState(false);
  // const handleCollect = () => {
  //   setCollecting(true);
  //   chrome.runtime.sendMessage(
  //     {
  //       resourceId: data.resourceId,
  //       namespaceId: data.namespaceId,
  //       type: 'collect',
  //       action: 'collect',
  //       baseUrl: data.apiBaseUrl,
  //       pageUrl: document.URL,
  //       pageTitle: document.title,
  //       data: document.documentElement.outerHTML,
  //     },
  //     response => {
  //       setCollecting(false);
  //       if (response && response.error) {
  //         toast.error(response.error, { position: 'top-center' });
  //       } else {
  //         // setDoneUrl(response.data.resource_id);
  //       }
  //     },
  //   );
  // };

  useEffect(() => {
    track('open_chrome_popup', {
      once: true,
      section: 'ext_popup',
    });
  }, []);

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

  return (
    <Wrapper isVisible={isVisible}>
      <Header refetch={refetch} baseUrl={data.apiBaseUrl} />
      <Auth />
      {/* <Collect loading={collecting} onClick={handleCollect} />
      <Save data={data} />
      <Section />
      <SectionText /> */}
    </Wrapper>
  );
}

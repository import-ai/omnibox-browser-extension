import Page from './Page';
import { withErrorBoundary, withSuspense } from '@extension/shared';
import { useTranslation } from 'react-i18next';
import './i18n';

interface AppProps {
  isOmniboxPro?: boolean;
}

function LoadingComponent() {
  const { t } = useTranslation();
  return <div>{t('loading')}</div>;
}

function ErrorComponent() {
  const { t } = useTranslation();
  return <div>{t('error_occurred')}</div>;
}

function App({ isOmniboxPro = false }: AppProps) {
  return <Page isOmniboxPro={isOmniboxPro} />;
}

export default withErrorBoundary(withSuspense(App, <LoadingComponent />), <ErrorComponent />);

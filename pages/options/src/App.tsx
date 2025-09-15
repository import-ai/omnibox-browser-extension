import Page from '@src/Page';
import { withErrorBoundary, withSuspense } from '@extension/shared';
import { useTranslation } from 'react-i18next';
import '@src/i18n';

function LoadingComponent() {
  const { t } = useTranslation();
  return <div>{t('loading')}</div>;
}

function ErrorComponent() {
  const { t } = useTranslation();
  return <div>{t('error_occurred')}</div>;
}

export default withErrorBoundary(withSuspense(Page, <LoadingComponent />), <ErrorComponent />);

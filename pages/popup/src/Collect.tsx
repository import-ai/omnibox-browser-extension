import { t } from '@extension/i18n';
import { Button } from '@extension/ui';
import { LoaderCircle, ChevronRight, Link } from 'lucide-react';

interface IProps {
  disabled: boolean;
  loading: boolean;
  onClick: () => void;
}

export default function Collect(props: IProps) {
  const { loading, disabled, onClick } = props;

  return (
    <Button
      variant="ghost"
      onClick={onClick}
      disabled={disabled}
      className="w-full flex items-center justify-between rounded-none font-normal h-12">
      <div className="flex items-center space-x-3">
        <Link />
        <span>{t('collect_submit')}</span>
      </div>
      {loading ? <LoaderCircle className="transition-transform animate-spin" /> : <ChevronRight />}
    </Button>
  );
}

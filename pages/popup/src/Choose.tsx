import { t } from '@extension/i18n';
import { Button } from '@extension/ui';
import { X, ChevronRight, SquareMousePointer } from 'lucide-react';

interface IProps {
  disabled: boolean;
  loading: boolean;
  onClick: () => void;
}

export default function Choose(props: IProps) {
  const { loading, disabled, onClick } = props;

  return (
    <Button
      variant="ghost"
      onClick={onClick}
      disabled={disabled}
      className="w-full flex items-center justify-between rounded-none font-normal h-12">
      {loading ? (
        <div className="flex items-center space-x-3">
          <X />
          <span>{t('choose_cancel')}</span>
        </div>
      ) : (
        <div className="flex items-center space-x-3">
          <SquareMousePointer />
          <span>{t('choose_area')}</span>
        </div>
      )}
      <ChevronRight />
    </Button>
  );
}

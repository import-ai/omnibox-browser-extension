import { Button } from '@extension/ui';
import { useTranslation } from 'react-i18next';
import { LoaderCircle, ChevronRight, SquareMousePointer } from 'lucide-react';

interface IProps {
  loading: boolean;
  onClick: () => void;
}

export default function Choose(props: IProps) {
  const { loading, onClick } = props;
  const { t } = useTranslation();

  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className="w-full flex items-center justify-between rounded-none font-normal h-12">
      <div className="flex items-center space-x-3">
        <SquareMousePointer />
        <span>{t('choose_area')}</span>
      </div>
      {loading ? <LoaderCircle className="transition-transform animate-spin" /> : <ChevronRight />}
    </Button>
  );
}

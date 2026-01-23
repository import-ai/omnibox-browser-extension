import { RestrictedPopup } from './index';
import { useAction } from '@src/provider/useAction';

interface Props {
  baseUrl: string;
}

export function RestrictedPopupContainer({ baseUrl }: Props) {
  const { restrictedPopup, onRestrictedPopup } = useAction();

  if (!restrictedPopup) {
    return null;
  }

  return (
    <RestrictedPopup restrictionType={restrictedPopup} onClose={() => onRestrictedPopup(null)} baseUrl={baseUrl} />
  );
}

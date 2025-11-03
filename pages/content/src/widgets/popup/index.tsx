import { Page } from './Page';
import type { Response } from '@extension/shared';
import { useAction } from '@src/provider/useAction';

export function PopupContainer(props: Response) {
  const { popup, onPopup } = useAction();

  if (!popup) {
    return null;
  }

  return <Page {...props} onPopup={onPopup} />;
}

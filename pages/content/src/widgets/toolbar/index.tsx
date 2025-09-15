import { useState } from 'react';
import { Wrapper } from './Wrapper';
import { Toolbars } from './toolbars';
import type { Storage } from '@extension/shared';
import { useAction } from '@src/provider/useAction';

export interface IProps {
  data: Storage;
  onChange: (val: unknown, key?: string) => void;
}

export function ToolbarContainer(props: IProps) {
  const { data, onChange } = props;
  const [disableTemp, onDisableTemp] = useState(false);
  const { popup, toolbar, onToolbar } = useAction();
  const disableSites = Array.isArray(data.disabledSites) ? data.disabledSites : [];
  const index = disableSites.findIndex(item => item.host === location.hostname);

  if (!data.selectionTextEnabled || index >= 0) {
    return null;
  }

  return (
    <Wrapper popup={popup} toolbar={toolbar} onToolbar={onToolbar} disableTemp={disableTemp}>
      <Toolbars data={data} onChange={onChange} onToolbar={onToolbar} onDisableTemp={onDisableTemp} />
    </Wrapper>
  );
}

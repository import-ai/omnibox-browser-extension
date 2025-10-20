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
  const [selection, onSelection] = useState('');
  const { popup, toolbar, onToolbar, disableTemp, onDisableTemp } = useAction();
  const disableSites = Array.isArray(data.disabledSites) ? data.disabledSites : [];
  const index = disableSites.findIndex(item => item.host === location.hostname);
  const handleDestory = () => {
    onSelection('');
  };

  if (!data.selectionTextEnabled || index >= 0 || disableTemp) {
    return null;
  }

  return (
    <Wrapper popup={popup} toolbar={toolbar} onToolbar={onToolbar} selection={selection} onSelection={onSelection}>
      <Toolbars
        data={data}
        selectionAction={false}
        onChange={onChange}
        toolbar={toolbar}
        onToolbar={onToolbar}
        onDestory={handleDestory}
        onDisableTemp={onDisableTemp}
      />
    </Wrapper>
  );
}

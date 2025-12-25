import { Wrapper } from './wrapper';
import { useEffect } from 'react';
import { Toolbars } from '../../toolbar/toolbars';
import type { Storage } from '@extension/shared';
import { clearSelection } from '../../toolbar/utils';
import { useAction } from '@src/provider/useAction';

export interface IProps {
  data: Storage;
  value: string;
  onDestroy: () => void;
  point: { x: number; y: number };
  onChange: (val: unknown, key?: string) => void;
}

export function Toolbar(props: IProps) {
  const { data, point, value, onChange, onDestroy } = props;
  const { popup, toolbar, onToolbar, disableTemp, onDisableTemp } = useAction();
  const disableSites = Array.isArray(data.disabledSites) ? data.disabledSites : [];
  const index = disableSites.findIndex(item => item.host === location.hostname);

  useEffect(() => {
    clearSelection();
    if (popup || value.length <= 0) {
      onToolbar('');
      return;
    }

    const timerId = window.setTimeout(() => {
      onToolbar(value);
    }, 400);

    return () => {
      clearTimeout(timerId);
    };
  }, [popup, value, onToolbar]);

  if (index >= 0 || disableTemp) {
    return null;
  }

  return (
    <Wrapper point={point} toolbar={toolbar}>
      <Toolbars
        data={data}
        selectionAction={true}
        onChange={onChange}
        toolbar={toolbar}
        onDestory={onDestroy}
        onToolbar={onToolbar}
        onDisableTemp={onDisableTemp}
      />
    </Wrapper>
  );
}

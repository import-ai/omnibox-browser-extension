import { Wrapper } from './wrapper';
import { Toolbar } from './toolbar';
import { useContext } from './useContext';
import { ActiveElement } from './element';
import type { Storage } from '@extension/shared';

export interface IProps {
  data: Storage;
  onChange: (val: unknown, key?: string) => void;
}

export function SectionContainer(props: IProps) {
  const { cursor, selected, point, onDestory } = useContext(props);
  const merged = selected.find(item => !!item.text);
  const selectedText = merged
    ? merged.text || ''
    : selected
        .filter(item => item.active)
        .map(item => item.element.outerHTML)
        .join('');

  if (selected.length <= 0 && !cursor) {
    return null;
  }

  return (
    <>
      <Wrapper active={cursor}>
        {selected.map(item => (
          <ActiveElement {...item} key={item.id} />
        ))}
      </Wrapper>
      <Toolbar {...props} point={point} value={selectedText} onDestory={onDestory} />
    </>
  );
}

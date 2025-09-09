import type { Storage } from '@extension/shared';

export interface IProps {
  data: Storage;
  refetch: () => void;
  onChange: (val: string | { [index: string]: string }, key?: string) => void;
}

import type { Storage } from '@extension/shared';

export interface IProps {
  data: Storage;
  refetch: () => void;
  onChange: (val: unknown, key?: string) => void;
}

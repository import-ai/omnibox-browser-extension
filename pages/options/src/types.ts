import type { Storage } from '@extension/shared';

export interface IProps {
  data: Storage;
  loading: boolean;
  refetch: () => void;
  onChange: (val: unknown, key?: string) => void;
}

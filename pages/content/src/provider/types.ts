export type Status = '' | 'pending' | 'done' | 'error';

export interface State {
  popup: boolean;
  onPopup: (popup: boolean | ((prev: boolean) => boolean)) => void;
  result: string;
  onResult: (result: string) => void;
  status: Status;
  onStatus: (status: Status) => void;
  toolbar: boolean;
  onToolbar: (toolbar: boolean) => void;
}

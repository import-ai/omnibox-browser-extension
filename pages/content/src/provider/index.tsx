import { Toaster } from 'sonner';
import type { State } from './types';
import { useStore } from './useStore';
import { UseContext } from './useContext';

interface IProps {
  children: React.ReactNode;
}

export function Provider(props: IProps) {
  const { children } = props;
  const store = useStore<State>();

  return (
    <UseContext.Provider value={store}>
      <Toaster />
      {children}
    </UseContext.Provider>
  );
}

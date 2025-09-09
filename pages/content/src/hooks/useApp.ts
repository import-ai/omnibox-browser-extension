import { useContext } from 'react';
import AppContext from './app-context';

export default function useApp() {
  return useContext(AppContext) as {
    root: HTMLElement;
    shadow: ShadowRoot;
    container: HTMLElement;
  };
}

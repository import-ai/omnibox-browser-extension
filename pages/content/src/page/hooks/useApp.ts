import { useContext } from 'react';
import AppContext from './app-context';
import type CoreApp from './app.class';

export default function useApp() {
  return useContext(AppContext) as {
    app: CoreApp;
    root: HTMLElement;
    shadow: ShadowRoot;
    container: HTMLElement;
  };
}

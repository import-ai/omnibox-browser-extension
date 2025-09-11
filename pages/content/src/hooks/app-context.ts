import { createContext } from 'react';

interface AppContextType {
  root: HTMLElement;
  shadow: ShadowRoot;
  container: HTMLElement;
}

export default createContext<AppContextType | null>(null);

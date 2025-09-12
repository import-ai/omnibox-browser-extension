import { useContext } from 'react';
import type { State } from './types';
import { UseContext } from './useContext';

export function useAction() {
  return useContext(UseContext) as State;
}

import { useContext } from 'react';
import { SaveBarContext } from './SaveBar.context';
import { SaveBarProps } from './SaveBar.types';

export const useSaveBar = () => {
  return useContext<SaveBarProps>(SaveBarContext);
};

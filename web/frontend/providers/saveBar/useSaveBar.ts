import { useContext } from 'react';
import { SaveBarContext } from './SaveBar.context';
import { SaveBarProps } from './SaveBar.types';

export const useSaveBar = () => {
  const context = useContext<SaveBarProps>(SaveBarContext);
  if (context === undefined) {
    throw new Error('useSaveBar must be used within a SaveBarProvider');
  }
  return context;
};

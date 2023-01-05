import { useContext } from 'react';
import { ModalContext } from './Modal.context';
import { ModalContextProps } from './Modal.types';

export const useModal = () => {
  const context = useContext<ModalContextProps>(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }

  return context;
};

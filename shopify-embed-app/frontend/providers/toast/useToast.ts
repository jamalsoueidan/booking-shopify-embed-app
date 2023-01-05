import { useContext } from 'react';
import { ToastContext } from './Toast.context';
import { ToastContextProps } from './Toast.types';

export const useToast = () => {
  const context = useContext<ToastContextProps>(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
};

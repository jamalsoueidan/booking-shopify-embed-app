import { createContext } from 'react';
import { ToastContextProps } from './Toast.types';

export const ToastContext = createContext<ToastContextProps>(null);

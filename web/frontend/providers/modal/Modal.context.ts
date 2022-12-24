import { createContext } from 'react';
import { ModalContextProps } from './Modal.types';

export const ModalContext = createContext<ModalContextProps>(null);

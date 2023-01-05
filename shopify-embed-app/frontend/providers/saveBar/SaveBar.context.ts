import { createContext } from 'react';
import { SaveBarProps } from './SaveBar.types';

export const SaveBarContext = createContext<SaveBarProps>(null);

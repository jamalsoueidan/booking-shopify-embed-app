import { Setting } from '@jamalsoueidan/bsb.mongodb.types';
import { createContext } from 'react';

export const SettingsContext = createContext<Setting>(null);

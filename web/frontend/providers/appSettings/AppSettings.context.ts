import { createContext } from 'react';
import { AppSettingsProps } from './AppSettings.types';

export const AppSettingsContext = createContext<AppSettingsProps>(null);

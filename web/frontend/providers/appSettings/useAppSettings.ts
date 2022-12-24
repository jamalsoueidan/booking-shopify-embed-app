import { useContext } from 'react';
import { AppSettingsContext } from './AppSettings.context';
import { AppSettingsProps } from './AppSettings.types';

export const useAppSettings = () => {
  const context = useContext<AppSettingsProps>(AppSettingsContext);
  if (context === undefined) {
    throw new Error('useAppSettings must be used within a AppSettingsProvider');
  }
  return context;
};

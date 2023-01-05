import { useContext } from 'react';
import { SettingsContext } from './Settings.context';

export const useSettings = () => {
  const context = useContext<Setting>(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

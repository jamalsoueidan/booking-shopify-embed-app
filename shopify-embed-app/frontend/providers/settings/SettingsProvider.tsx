import LoadingPage from '@components/LoadingPage';
import { useSetting } from '@services/setting';
import { SettingsContext } from './Settings.context';

export const SettingsProvider = ({ children }: any) => {
  const { data } = useSetting();

  if (!data) {
    return <LoadingPage title="Loading application settings"></LoadingPage>;
  }

  return (
    <SettingsContext.Provider value={data}>{children}</SettingsContext.Provider>
  );
};

import LoadingPage from '@components/LoadingPage';
import { useSetting } from '@services/setting';
import { SettingsContext } from './Settings.context';

export const SettingsProvider = ({ children }: any) => {
  const { data } = useSetting();

  if (!data) {
    return <LoadingPage></LoadingPage>;
  }

  return (
    <SettingsContext.Provider value={data}>{children}</SettingsContext.Provider>
  );
};

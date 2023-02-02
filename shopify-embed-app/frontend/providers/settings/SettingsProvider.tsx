import { LoadingPage } from "@jamalsoueidan/bsf.bsf-pkg";
import { useSetting } from "@services/setting";
import { SettingsContext } from "./Settings.context";

export const SettingsProvider = ({ children }: any) => {
  const { data } = useSetting();

  if (!data) {
    return <LoadingPage title="Loading application settings" />;
  }

  return (
    <SettingsContext.Provider value={data}>{children}</SettingsContext.Provider>
  );
};

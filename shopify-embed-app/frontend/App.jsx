import { SettingsProvider } from "@jamalsoueidan/bsf.bsf-pkg";
import { setDefaultOptions } from "date-fns";
import da from "date-fns/locale/da";
import { useMemo } from "react";
import { BrowserRouter } from "react-router-dom";
import Navigation from "./Navigation";
import Routes from "./Routes";
import { AppBridgeProvider, QueryProvider } from "./providers";
import { AppBridgeLink } from "./providers/PolarisProvider";
import { useSetting } from "./services/setting";

export default function App() {
  return (
    <BrowserRouter>
      <AppBridgeProvider>
        <QueryProvider>
          <Provider>
            <Navigation>
              <Routes />
            </Navigation>
          </Provider>
        </QueryProvider>
      </AppBridgeProvider>
    </BrowserRouter>
  );
}

const Provider = ({ children }) => {
  const { data } = useSetting();

  const value = useMemo(
    () => ({
      language: data?.language || "da",
      timeZone: data?.timeZone || "Europe/Copenhagen",
    }),
    [data],
  );

  setDefaultOptions({ locale: value.language === "da" ? da : undefined });
  return (
    <SettingsProvider value={value} linkComponent={AppBridgeLink}>
      {children}
    </SettingsProvider>
  );
};

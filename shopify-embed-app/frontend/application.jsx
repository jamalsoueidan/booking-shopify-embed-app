import { SettingsProvider } from "@jamalsoueidan/pkg.bsf";
import { setDefaultOptions } from "date-fns";
import da from "date-fns/locale/da";
import { useMemo } from "react";
import { BrowserRouter } from "react-router-dom";
import { ApplicationNavigation } from "./application-navigation";
import { ApplicationRoutes } from "./application-routes";
import { AppBridgeProvider, QueryProvider } from "./providers";
import { AppBridgeLink } from "./providers/PolarisProvider";
import { useSetting } from "./services/setting";

export default function App() {
  return (
    <BrowserRouter>
      <AppBridgeProvider>
        <QueryProvider>
          <Provider>
            <ApplicationNavigation>
              <ApplicationRoutes />
            </ApplicationNavigation>
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

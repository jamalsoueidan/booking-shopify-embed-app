import {
  AbilityProvider,
  FetchProvider,
  SettingsProvider,
  defineAbilityFor,
} from "@jamalsoueidan/pkg.frontend";
import { useNavigate } from "@shopify/app-bridge-react";
import { setDefaultOptions } from "date-fns";
import da from "date-fns/locale/da";
import { useMemo } from "react";
import { BrowserRouter } from "react-router-dom";
import { ApplicationNavigation } from "./application-navigation";
import { ApplicationRoutes } from "./application-routes";
import { useFetch } from "./hooks/use-fetch";
import { AppBridgeProvider, QueryProvider } from "./providers";
import { AppBridgeLink } from "./providers/PolarisProvider";
import { useSetting } from "./services/setting";

export const FetchProviderWrapper = () => {
  const fetch = useFetch();
  const ability = defineAbilityFor({
    user: { isAdmin: false, isOwner: true, isUser: false },
  });

  return (
    <FetchProvider fetch={fetch}>
      <AbilityProvider ability={ability}>
        <Provider>
          <ApplicationNavigation>
            <ApplicationRoutes />
          </ApplicationNavigation>
        </Provider>
      </AbilityProvider>
    </FetchProvider>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppBridgeProvider>
        <QueryProvider>
          <FetchProviderWrapper />
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
      LinkComponent: AppBridgeLink,
      timeZone: data?.timeZone || "Europe/Copenhagen",
      useNavigate,
    }),
    [data],
  );

  setDefaultOptions({ locale: value.language === "da" ? da : undefined });
  return <SettingsProvider value={value}>{children}</SettingsProvider>;
};

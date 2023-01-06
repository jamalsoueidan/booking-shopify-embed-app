import { Frame } from "@shopify/polaris";
import { I18nContext, I18nManager } from "@shopify/react-i18n";
import { AppNavigation } from "components/AppNavigation";
import { AppPage } from "components/AppPage";
import { AppTopBar } from "components/AppTopBar";
import { PolarisProvider } from "providers/PolarisProvider";
import { useCallback, useState } from "react";
import logo from "./logo.svg";

const i18nManager = new I18nManager({
  locale: "en-US",
});

export default () => {
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);

  const toggleMobileNavigationActive = useCallback(
    () =>
      setMobileNavigationActive(
        (mobileNavigationActive) => !mobileNavigationActive
      ),
    []
  );

  const logoOptions = {
    width: 124,
    topBarSource: logo,
    contextualSaveBarSource:
      "https://cdn.shopify.com/s/files/1/0446/6937/files/jaded-pixel-logo-gray.svg?6215648040070010999",
    url: "http://jadedpixel.com",
    accessibilityLabel: "Jaded Pixel",
  };

  return (
    <I18nContext.Provider value={i18nManager}>
      <PolarisProvider>
        <Frame
          logo={logoOptions}
          topBar={<AppTopBar toggleNavigation={setMobileNavigationActive} />}
          navigation={<AppNavigation />}
          showMobileNavigation={mobileNavigationActive}
          onNavigationDismiss={toggleMobileNavigationActive}
        >
          <AppPage />
        </Frame>
      </PolarisProvider>
    </I18nContext.Provider>
  );
};

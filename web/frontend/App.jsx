import { I18nContext, I18nManager } from '@shopify/react-i18n';
import { BrowserRouter } from 'react-router-dom';
import Routes from './Routes';
import Translation from './Translation';
import Navigation from './Navigation';
import { AppBridgeProvider, PolarisProvider, QueryProvider } from './providers';
import { SettingsProvider } from './providers/settings';

const i18nManager = new I18nManager({
  locale: 'en',
});

export default function App() {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info

  return (
    <I18nContext.Provider value={i18nManager}>
      <PolarisProvider>
        <BrowserRouter>
          <AppBridgeProvider>
            <QueryProvider>
              <SettingsProvider>
                <Translation>
                  <Navigation>
                    <Routes />
                  </Navigation>
                </Translation>
              </SettingsProvider>
            </QueryProvider>
          </AppBridgeProvider>
        </BrowserRouter>
      </PolarisProvider>
    </I18nContext.Provider>
  );
}

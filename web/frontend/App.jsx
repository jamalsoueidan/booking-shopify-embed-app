import { I18nContext, I18nManager } from '@shopify/react-i18n';
import { BrowserRouter } from 'react-router-dom';
import Routes from './Routes';
import Translation from './Translation';
import Navigation from './Navigation';
import { AppBridgeProvider, PolarisProvider, QueryProvider } from './providers';
import { SettingsProvider } from './providers/settings';

const i18nManager = new I18nManager({
  interpolation: { escapeValue: false },
  locale: 'en',
});

export default function App() {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.globEager('./pages/**/!(*.test.[jt]sx)*.([jt]sx)');

  return (
    <I18nContext.Provider value={i18nManager}>
      <PolarisProvider>
        <BrowserRouter>
          <AppBridgeProvider>
            <QueryProvider>
              <SettingsProvider>
                <Translation>
                  <Navigation>
                    <Routes pages={pages} />
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

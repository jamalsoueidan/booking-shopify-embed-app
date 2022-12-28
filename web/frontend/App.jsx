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
  return (
    <I18nContext.Provider value={i18nManager}>
      <PolarisProvider>
        <BrowserRouter>
          <AppBridgeProvider>
            <QueryProvider>
              <Routes />
            </QueryProvider>
          </AppBridgeProvider>
        </BrowserRouter>
      </PolarisProvider>
    </I18nContext.Provider>
  );
}

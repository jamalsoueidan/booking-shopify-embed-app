import { I18nContext, I18nManager } from '@shopify/react-i18n';
import { BrowserRouter } from 'react-router-dom';
import { AppBridgeProvider, PolarisProvider, QueryProvider } from './providers';
import Routes from './Routes';
import Wrapper from './Wrapper';

export default function App() {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.globEager('./pages/**/!(*.test.[jt]sx)*.([jt]sx)');

  const i18nManager = new I18nManager({
    interpolation: { escapeValue: false },
    locale: 'en',
  });

  return (
    <I18nContext.Provider value={i18nManager}>
      <PolarisProvider>
        <BrowserRouter>
          <AppBridgeProvider>
            <QueryProvider>
              <Wrapper>
                <Routes pages={pages} />
              </Wrapper>
            </QueryProvider>
          </AppBridgeProvider>
        </BrowserRouter>
      </PolarisProvider>
    </I18nContext.Provider>
  );
}

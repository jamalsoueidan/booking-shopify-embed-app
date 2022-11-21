import { BrowserRouter } from 'react-router-dom';
import {
  AppBridgeProvider,
  PolarisProvider,
  QueryProvider,
} from './components/providers';
import Routes from './Routes';
import Tabs from './Tabs';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import da from './translations/da.json';
import en from './translations/en.json';

i18next.init({
  interpolation: { escapeValue: false }, // React already does escaping
  lng: 'en', // language to use
  resources: {
    en,
    da,
  },
});

export default function App() {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.globEager('./pages/**/!(*.test.[jt]sx)*.([jt]sx)');

  return (
    <PolarisProvider>
      <BrowserRouter>
        <AppBridgeProvider>
          <QueryProvider>
            <I18nextProvider i18n={i18next}>
              <Tabs>
                <Routes pages={pages} />
              </Tabs>
            </I18nextProvider>
          </QueryProvider>
        </AppBridgeProvider>
      </BrowserRouter>
    </PolarisProvider>
  );
}

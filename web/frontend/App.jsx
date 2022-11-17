import { BrowserRouter } from 'react-router-dom';
import {
  AppBridgeProvider,
  PolarisProvider,
  QueryProvider,
} from './components/providers';
import Routes from './Routes';
import Tabs from './Tabs';

export default function App() {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.globEager('./pages/**/!(*.test.[jt]sx)*.([jt]sx)');

  return (
    <PolarisProvider>
      <BrowserRouter>
        <AppBridgeProvider>
          <QueryProvider>
            <Tabs>
              <Routes pages={pages} />
            </Tabs>
          </QueryProvider>
        </AppBridgeProvider>
      </BrowserRouter>
    </PolarisProvider>
  );
}

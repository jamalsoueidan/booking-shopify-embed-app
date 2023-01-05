import { SaveBarProvider } from '@providers/saveBar';
import { ToastProvider } from '@providers/toast';
import { NavigationMenu } from '@shopify/app-bridge-react';
import { NavigationLink } from '@shopify/app-bridge-react/components/NavigationMenu/NavigationMenu';
import { Frame, Loading } from '@shopify/polaris';
import { useCallback } from 'react';
import { Query, useIsFetching } from 'react-query';
import { useTranslation } from './hooks';

export default ({ children }: any) => {
  const isFetching = useIsFetching({
    predicate: (query: Query) => query.state.isFetching,
  });

  const { t } = useTranslation('tabs');

  const matcher = useCallback(
    (link: NavigationLink, location: Location) =>
      location.pathname.toLowerCase().indexOf(link.destination) !== -1,
    []
  );

  return (
    <>
      <NavigationMenu
        navigationLinks={[
          {
            destination: '/bookings',
            label: t('bookings'),
          },
          {
            destination: '/collections',
            label: t('collections'),
          },
          {
            destination: '/staff',
            label: t('staff'),
          },
          {
            destination: '/settings',
            label: t('settings'),
          },
        ]}
        matcher={matcher}
      />
      <Frame>
        {isFetching > 0 && <Loading />}

        <SaveBarProvider>
          <ToastProvider>{children}</ToastProvider>
        </SaveBarProvider>
      </Frame>
    </>
  );
};

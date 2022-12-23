import { useSetting } from '@services';
import { NavigationMenu } from '@shopify/app-bridge-react';
import { NavigationLink } from '@shopify/app-bridge-react/components/NavigationMenu/NavigationMenu';
import { Frame, Loading } from '@shopify/polaris';
import { I18nContext, I18nManager, useI18n } from '@shopify/react-i18n';
import { SaveBarProvider } from '@providers/saveBar';
import { useCallback, useContext, useEffect } from 'react';
import { Query, useIsFetching } from 'react-query';
import en from './translations/en.json';

export default ({ children }: { children: JSX.Element }) => {
  const { data } = useSetting();

  const i18nManager = useContext<I18nManager>(I18nContext);

  const isFetching = useIsFetching({
    predicate: (query: Query) => query.state.isFetching,
  });

  const [i18n, ShareTranslations] = useI18n({
    id: 'Application',
    fallback: en,
    async translations(locale: string) {
      return locale === 'en' ? en : import('./translations/da.json');
    },
  });

  useEffect(() => {
    i18nManager.update({ locale: data.language });
  }, []);

  useEffect(() => {
    i18nManager.update({ locale: data.language });
  }, [data]);

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
            label: i18n.translate('tabs.bookings'),
          },
          {
            destination: '/collections',
            label: i18n.translate('tabs.collections'),
          },
          {
            destination: '/staff',
            label: i18n.translate('tabs.staff'),
          },
          {
            destination: '/settings',
            label: i18n.translate('tabs.settings'),
          },
        ]}
        matcher={matcher}
      />
      <Frame>
        {isFetching > 0 && <Loading></Loading>}
        <ShareTranslations>
          <SaveBarProvider>{children}</SaveBarProvider>
        </ShareTranslations>
      </Frame>
    </>
  );
};

import { useSetting } from '@services';
import { NavigationMenu } from '@shopify/app-bridge-react';
import { I18nContext, useI18n, I18nManager } from '@shopify/react-i18n';
import { useContext, useEffect } from 'react';
import en from './translations/en.json';
import { Frame, Loading } from '@shopify/polaris';
import { Query, useIsFetching } from 'react-query';

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
        matcher={(link, location) =>
          location.pathname.toLowerCase().indexOf(link.destination) !== -1
        }
      />
      <Frame>
        {isFetching > 0 && <Loading></Loading>}
        <ShareTranslations>{children}</ShareTranslations>
      </Frame>
    </>
  );
};

import LoadingPage from '@components/LoadingPage';
import { useSetting } from '@services';
import { NavigationMenu } from '@shopify/app-bridge-react';
import { Frame } from '@shopify/polaris';
import { I18nContext, useI18n, I18nManager } from '@shopify/react-i18n';
import { useContext, useEffect } from 'react';
import en from './translations/en.json';

export default ({ children }: { children: JSX.Element }) => {
  const { data } = useSetting();

  const i18nManager = useContext<I18nManager>(I18nContext);

  const [i18n, ShareTranslations] = useI18n({
    id: 'Application',
    fallback: en,
    async translations(locale: string) {
      return locale === 'en' ? en : import('./translations/da.json');
    },
  });

  if (!data) {
    return <LoadingPage />;
  }

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
        <ShareTranslations>{children}</ShareTranslations>
      </Frame>
    </>
  );
};

import LoadingPage from '@components/LoadingPage';
import { useSettingGet } from '@services/setting';
import { NavigationMenu } from '@shopify/app-bridge-react';
import { Frame } from '@shopify/polaris';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default ({ children }: { children: JSX.Element }) => {
  const { data } = useSettingGet();
  const { language } = data;

  const { t, i18n } = useTranslation('tabs');

  if (!data) {
    return <LoadingPage />;
  }

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

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
      />
      <Frame>{children}</Frame>
    </>
  );
};

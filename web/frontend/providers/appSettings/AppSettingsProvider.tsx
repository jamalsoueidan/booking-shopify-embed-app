import { useSetting } from '@services/setting';
import { I18nContext, I18nManager, useI18n } from '@shopify/react-i18n';
import { useContext, useEffect } from 'react';
import en from '../../translations/en.json';
import { AppSettingsContext } from './AppSettings.context';
import LoadingPage from '@components/LoadingPage';

export const AppSettingsProvider = ({ children }: any) => {
  const { data } = useSetting();

  const i18nManager = useContext<I18nManager>(I18nContext);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [i18n, ShareTranslations] = useI18n({
    id: 'Application',
    fallback: en,
    async translations(locale: string) {
      console.log('translations', locale);
      return locale === 'en' ? en : import('../../translations/da.json');
    },
  });

  useEffect(() => {
    console.log('update', data?.language);
    i18nManager.update({ locale: data?.language || 'en' });
  }, [data, i18nManager, i18n.language]);

  return (
    <AppSettingsContext.Provider value={data}>
      <ShareTranslations>{data ? children : <LoadingPage />}</ShareTranslations>
    </AppSettingsContext.Provider>
  );
};

import LoadingPage from '@components/LoadingPage';
import { useSettings } from '@providers/settings';
import { I18nContext, I18nManager, useI18n } from '@shopify/react-i18n';
import { useContext, useEffect } from 'react';
import en from './translations/en.json';
import da from './translations/da.json';

export default ({ children }: { children: JSX.Element }) => {
  const { language } = useSettings();

  const i18nManager = useContext<I18nManager>(I18nContext);

  const [i18n, ShareTranslations] = useI18n({
    id: 'Application',
    fallback: en,
    translations(locale: string) {
      return locale === 'en-US' ? en : da;
    },
  });

  useEffect(() => {
    i18nManager.update({ locale: language });
  }, []);

  useEffect(() => {
    i18nManager.update({ locale: language });
  }, [language]);

  if (language !== i18n.locale || i18n.translations.length < 2) {
    return <LoadingPage title="Loading translations"></LoadingPage>;
  }

  return <ShareTranslations>{children}</ShareTranslations>;
};

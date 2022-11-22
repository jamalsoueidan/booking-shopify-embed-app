import { useSettingGet } from '@services/setting';
import { useNavigate } from '@shopify/app-bridge-react';
import { Tabs } from '@shopify/polaris';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default ({ children }: { children: JSX.Element }) => {
  const navigate = useNavigate();

  const [selected, setSelected] = useState<number>(null);
  const { data } = useSettingGet();
  const { language } = data;

  const { t, i18n } = useTranslation('tabs');

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  const tabs = [
    {
      id: 'bookings',
      content: t('bookings'),
    },
    {
      id: 'collections',
      content: t('collections'),
    },
    {
      id: 'staff',
      content: t('staff'),
    },
    {
      id: 'settings',
      content: t('settings'),
    },
  ];

  const handleTabChange = useCallback((selectedTabIndex: number) => {
    setSelected(selectedTabIndex);
    navigate(`/${tabs[selectedTabIndex].id}`);
  }, []);

  useEffect(() => {
    handleTabChange(0);
  }, []);

  return (
    <>
      <div style={{ backgroundColor: '#fff' }}>
        <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}></Tabs>
      </div>
      {children}
    </>
  );
};

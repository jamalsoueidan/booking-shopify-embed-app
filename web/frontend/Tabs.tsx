import { useNavigate } from '@shopify/app-bridge-react';
import { Tabs } from '@shopify/polaris';
import { useCallback, useEffect, useState } from 'react';

export default ({ children }: { children: JSX.Element }) => {
  const navigate = useNavigate();

  const [selected, setSelected] = useState<number>(null);

  const tabs = [
    {
      id: 'bookings',
      content: 'Bookings',
      panelID: 'bookings',
    },
    {
      id: 'collections',
      content: 'Collections',
      panelID: 'collections',
    },
    {
      id: 'staff',
      content: 'Staff',
      panelID: 'staff',
    },
    {
      id: 'setting',
      content: 'Settings',
      panelID: 'settings',
    },
  ];

  const handleTabChange = useCallback((selectedTabIndex: number) => {
    setSelected(selectedTabIndex);
    navigate(`/${tabs[selectedTabIndex].content}`);
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

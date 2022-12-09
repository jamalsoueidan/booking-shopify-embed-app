import { Card, Tabs } from '@shopify/polaris';
import { useCallback, useState } from 'react';
import BookingModalCustomer from './BookingModalCustomer';
import BookingModalNotification from './BookingModalNotification';
import BookingModalProduct from './BookingModalProduct';
import BookingModalSendNotification from './BookingModalSendNotification';

export const BookingModalTabs = ({ info }: BookingModalChildProps) => {
  const [selected, setSelected] = useState(0);

  const tabs = [
    {
      id: 'treatment',
      content: 'Behandling',
      component: BookingModalProduct,
    },
    {
      id: 'customer',
      content: 'Kunde',
      component: BookingModalCustomer,
    },
    {
      id: 'notification',
      content: 'Meddelelser',
      component: BookingModalNotification,
    },
    {
      id: 'send',
      content: 'Send Meddelelser',
      component: BookingModalSendNotification,
    },
  ];

  const handleTabChange = useCallback((selectedTabIndex: number) => {
    setSelected(selectedTabIndex);
  }, []);

  const Component = tabs[selected].component;
  return (
    <Card>
      <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
        <Component info={info} />
      </Tabs>
    </Card>
  );
};

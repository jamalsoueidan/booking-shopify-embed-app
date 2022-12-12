import { Card, ComplexAction, Modal, Tabs } from '@shopify/polaris';
import { useCallback, useState } from 'react';
import BookingModalCustomer from './BookingModalCustomer';
import BookingModalNotification from './BookingModalNotification';
import BookingModalProduct from './BookingModalProduct';
import BookingModalSendNotification from './BookingModalSendNotification';

interface BookingModalProps {
  show: boolean;
  toggle: any;
  info: Booking;
}

export default ({ show, toggle, info }: BookingModalProps) => {
  const [primaryAction, setPrimaryAction] = useState<ComplexAction>();
  const [secondaryActions, setSecondaryActions] = useState<ComplexAction[]>();

  const close = () => {
    toggle(null);
  };

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
    setPrimaryAction(null);
    setSecondaryActions(null);
    setSelected(selectedTabIndex);
  }, []);

  const Component = tabs[selected].component;

  return (
    <Modal
      large
      open={show}
      onClose={close}
      title={info.product.title}
      primaryAction={primaryAction}
      secondaryActions={secondaryActions}>
      <Card>
        <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
          <Component
            info={info}
            setPrimaryAction={setPrimaryAction}
            setSecondaryActions={setSecondaryActions}
          />
        </Tabs>
      </Card>
    </Modal>
  );
};

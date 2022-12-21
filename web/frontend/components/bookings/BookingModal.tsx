import { Card, ComplexAction, Modal, Tabs } from '@shopify/polaris';
import { useCallback, useMemo, useState } from 'react';
import BookingModalCustomer from './BookingModalCustomer';
import BookingModalNotification from './BookingModalNotification';
import BookingModalProduct from './BookingModalProduct';
import BookingModalSendNotification from './BookingModalSendNotification';

interface BookingModalProps {
  show: boolean;
  toggle: any;
  info: BookingAggreate;
}

export default ({ show, toggle, info }: BookingModalProps) => {
  const [primaryAction, setPrimaryAction] = useState<ComplexAction>();
  const [secondaryActions, setSecondaryActions] = useState<ComplexAction[]>();

  const close = useCallback(() => {
    toggle(null);
  }, []);

  const [selected, setSelected] = useState(0);

  const tabs = useMemo(() => {
    const t = [
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
    ];

    if (!info.fulfillmentStatus) {
      t.push({
        id: 'send',
        content: 'Send Meddelelser',
        component: BookingModalSendNotification,
      });
    }
    return t;
  }, [info]);

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

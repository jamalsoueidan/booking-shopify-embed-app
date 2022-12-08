import { Modal } from '@shopify/polaris';
import { useCallback, useState } from 'react';
import { BookingModalTabs } from './BookingModalTabs';

interface BookingModalProps {
  show: boolean;
  toggle: any;
  info: Info.Data;
}

export default ({ show, toggle, info }: BookingModalProps) => {
  const close = () => {
    toggle(null);
  };

  return (
    <Modal
      large
      open={show}
      onClose={close}
      title={info.product.title}
      primaryAction={{
        content: 'Close',
        onAction: close,
      }}>
      <BookingModalTabs info={info}></BookingModalTabs>
    </Modal>
  );
};

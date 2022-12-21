import { Modal } from '@shopify/polaris';
import { useMemo } from 'react';

interface ModalConfirmProps {
  active: boolean;
  setActive: (value: boolean) => void;
}

export default ({ active, setActive }: ModalConfirmProps) => {
  const primaryAction = useMemo(
    () => ({
      content: 'Delete',
      onAction: () => setActive(true),
    }),
    []
  );

  const secondaryActions = useMemo(
    () => [
      {
        content: 'Cancel',
        onAction: () => setActive(false),
      },
    ],
    []
  );

  return (
    <Modal
      small
      open={active}
      onClose={() => setActive(false)}
      title="Remove product"
      primaryAction={primaryAction}
      secondaryActions={secondaryActions}>
      <Modal.Section>
        <p>
          All settings will be deleted, This action can't be undone. This will
          not remove the product from your store.
        </p>
      </Modal.Section>
    </Modal>
  );
};

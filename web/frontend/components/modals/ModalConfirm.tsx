import { Modal } from '@shopify/polaris';
import { useCallback } from 'react';

interface ModalConfirmProps {
  active: boolean;
  setActive: (value: boolean) => {};
}
export default ({ active, setActive }: ModalConfirmProps) => {
  const toggleActive = useCallback(() => setActive(null), []);

  return (
    <Modal
      small
      open={active}
      onClose={toggleActive}
      title="Remove product"
      primaryAction={{
        content: 'Delete',
        onAction: () => setActive(true),
      }}
      secondaryActions={[
        {
          content: 'Cancel',
          onAction: toggleActive,
        },
      ]}>
      <Modal.Section>
        <p>
          All settings will be deleted, This action can't be undone. This will
          not remove the product from your store.
        </p>
      </Modal.Section>
    </Modal>
  );
};

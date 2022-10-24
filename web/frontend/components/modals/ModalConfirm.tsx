import { Modal } from "@shopify/polaris";
import { useCallback } from "react";

export default ({ active, setActive }) => {
  const toggleActive = useCallback(() => setActive(null), []);

  return (
    <Modal
      small
      open={active}
      onClose={toggleActive}
      title="You want to delete ?"
      primaryAction={{
        content: "Delete",
        onAction: () => setActive(true),
      }}
      secondaryActions={[
        {
          content: "Cancel",
          onAction: toggleActive,
        },
      ]}
    >
      <Modal.Section>
        <p>This action cannot be undone!</p>
      </Modal.Section>
    </Modal>
  );
};

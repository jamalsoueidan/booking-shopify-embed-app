import { Card } from "@shopify/polaris";
import { useCallback, useState } from "react";
import AddStaff from "./AddStaff";
import ExistingStaff from "./ExistingStaff";

export default ({ productId }: { productId: string }) => {
  const [showStaff, setShowStaff] = useState<boolean>(false);
  const [canDelete, setCanDelete] = useState<boolean>(false);

  const toggleShowStaff = useCallback(
    () => setShowStaff((showStaff) => !showStaff),
    []
  );

  const toggleCanDelete = useCallback(
    () => setCanDelete((canDelete) => !canDelete),
    []
  );

  return (
    <Card
      title="Staff"
      actions={[
        {
          content: canDelete ? "Færdig" : "Administrer",
          onAction: toggleCanDelete,
        },
      ]}
    >
      <Card.Section>
        <ExistingStaff
          productId={productId}
          toggleAddStaff={toggleShowStaff}
          canDelete={canDelete}
          toggleCanDelete={setCanDelete}
        ></ExistingStaff>
      </Card.Section>
      {showStaff && (
        <Card.Section>
          <AddStaff
            productId={productId}
            setShowStaff={toggleShowStaff}
          ></AddStaff>
        </Card.Section>
      )}
    </Card>
  );
};

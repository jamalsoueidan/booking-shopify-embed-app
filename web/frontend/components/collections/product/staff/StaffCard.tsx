import { Card } from "@shopify/polaris";
import { useCallback, useState } from "react";
import AddStaff from "./AddStaff";
import ExistingStaff from "./ExistingStaff";

export default ({ productId }: { productId: string }) => {
  const [showStaff, setShowStaff] = useState<boolean>(false);

  const toggleShowStaff = useCallback(
    () => setShowStaff((showStaff) => !showStaff),
    []
  );

  return (
    <Card title="Staff">
      <Card.Section>
        <ExistingStaff
          productId={productId}
          toggleAddStaff={toggleShowStaff}
        ></ExistingStaff>
      </Card.Section>
      <Card.Section>
        {showStaff && (
          <AddStaff
            productId={productId}
            setShowStaff={toggleShowStaff}
          ></AddStaff>
        )}
      </Card.Section>
    </Card>
  );
};

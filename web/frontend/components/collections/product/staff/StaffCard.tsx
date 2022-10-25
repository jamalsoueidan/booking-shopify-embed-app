import { Card, Stack } from "@shopify/polaris";
import { useCallback, useState } from "react";
import AddStaff from "./AddStaff";
import StaffAvatar from "./StaffAvatar";

export default ({
  productId,
  staff,
}: {
  productId: string;
  staff: Array<ProductStaff> | null;
}) => {
  const [showStaff, setShowStaff] = useState<boolean>(false);

  const toggleShowStaff = useCallback(
    () => setShowStaff((showStaff) => !showStaff),
    []
  );

  const staffExistsMarkup = staff.map((staff) => (
    <Stack spacing="loose" key={staff._id}>
      <StaffAvatar fullname={staff.fullname} />
    </Stack>
  ));

  const addStaffMarkup = (
    <Stack spacing="loose">
      {staffExistsMarkup}
      <span style={{ cursor: "pointer" }} onClick={toggleShowStaff}>
        <StaffAvatar fullname="Add" />
      </span>
    </Stack>
  );

  return (
    <Card title="Staff">
      <Card.Section>{addStaffMarkup}</Card.Section>
      <AddStaff
        showStaff={showStaff}
        setShowStaff={toggleShowStaff}
        productId={productId}
      ></AddStaff>
    </Card>
  );
};

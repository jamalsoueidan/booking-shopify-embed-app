import { StaffForm, useStaffCreate } from "@jamalsoueidan/pkg.frontend";
import { useNavigate } from "@shopify/app-bridge-react";
import { useCallback } from "react";

export default () => {
  const navigate = useNavigate();
  const { create } = useStaffCreate();

  const submit = useCallback(
    async (fieldValues: any) => {
      const staff = await create(fieldValues);
      navigate(`/staff/${staff.payload?._id}`);
    },
    [create, navigate],
  );

  return (
    <StaffForm
      action={submit}
      breadcrumbs={[{ content: "Staff", onAction: () => navigate("/staff") }]}
      allowEditing={{ active: true, group: true, role: true }}
    />
  );
};

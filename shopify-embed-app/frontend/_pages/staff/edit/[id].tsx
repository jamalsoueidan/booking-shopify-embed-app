import Metadata from "@components/staff/Metadata";
import { StaffForm } from "@jamalsoueidan/bsf.bsf-pkg";
import { useStaffGet, useStaffUpdate } from "@services";
import { useNavigate } from "@shopify/app-bridge-react";
import { useCallback } from "react";
import { useParams } from "react-router-dom";

export default () => {
  const params = useParams();
  const navigate = useNavigate();

  const { data: staff } = useStaffGet({ userId: params.id });
  const { update } = useStaffUpdate({ userId: params.id });

  const submit = useCallback(
    async (fieldValues: any) => {
      await update(fieldValues);
      navigate("/staff/" + staff._id);
    },
    [update, navigate, staff],
  );

  if (!staff) {
    return <></>;
  }

  return (
    <StaffForm
      data={staff}
      action={submit}
      breadcrumbs={[
        { content: "Staff", onAction: () => navigate("/staff/" + staff._id) },
      ]}
      titleMetadata={<Metadata active={staff.active} />}
    />
  );
};

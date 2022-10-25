import StaffPopover from "./AddStaff/StaffPopover";
import useSWR from "swr";
import { useAuthenticatedFetch } from "../../../../hooks";
import { Card, Stack } from "@shopify/polaris";

export default ({
  productId,
  showStaff,
  setShowStaff,
}: {
  productId: string;
  showStaff: boolean;
  setShowStaff: any;
}) => {
  const fetch = useAuthenticatedFetch();
  const { data: staff } = useSWR<ProductStaffApi>(
    showStaff ? `/api/admin/products/${productId}/staff` : null,
    (apiURL: string) => fetch(apiURL).then((res) => res.json())
  );

  if (!showStaff) {
    return <></>;
  }

  const staffer = staff?.payload?.map((s) => {
    return (
      <StaffPopover
        key={s._id}
        staff={s}
        productId={productId}
        toggleShowStaff={setShowStaff}
      ></StaffPopover>
    );
  });

  return (
    <Card.Section>
      <Stack>{staffer}</Stack>
    </Card.Section>
  );
};

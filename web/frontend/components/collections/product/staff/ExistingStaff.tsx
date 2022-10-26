import { Stack } from "@shopify/polaris";
import useSWR from "swr";
import StaffAvatar from "./StaffAvatar";
import { useAuthenticatedFetch } from "../../../../hooks";

export default ({
  productId,
  toggleAddStaff,
}: {
  productId: string;
  toggleAddStaff;
}) => {
  const fetch = useAuthenticatedFetch();
  const { data: staffier } = useSWR<ProductStaffApi>(
    `/api/admin/products/${productId}/staff`,
    (apiURL: string) => fetch(apiURL).then((res) => res.json())
  );

  if (!staffier) {
    return <>Loading...</>;
  }

  console.log(staffier);
  const staffierMarkup = staffier?.payload?.map((staff) => (
    <Stack spacing="loose" key={staff._id}>
      <StaffAvatar fullname={staff.fullname} />
    </Stack>
  ));

  return (
    <Stack spacing="loose">
      {staffierMarkup}
      <span style={{ cursor: "pointer" }} onClick={toggleAddStaff}>
        <StaffAvatar fullname="Add" />
      </span>
    </Stack>
  );
};

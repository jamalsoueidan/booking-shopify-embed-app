import { Stack } from '@shopify/polaris';
import useSWR from 'swr';
import { useAuthenticatedFetch } from '@hooks/useAuthenticatedFetch';
import StaffPopover from './AddStaff/StaffPopover';

export default ({
  productId,
  setShowStaff,
}: {
  productId: string;
  setShowStaff: any;
}) => {
  const fetch = useAuthenticatedFetch();
  const { data: staff } = useSWR<ProductStaffToAddApi>(
    `/api/admin/products/${productId}/staff-to-add`,
    (apiURL: string) => fetch(apiURL).then((res: Response) => res.json())
  );

  if (!staff) {
    return <>Loading...</>;
  }

  if (staff.payload.length === 0) {
    return <>Du har allerede tilføjet alle brugere</>;
  }

  const staffer = staff?.payload?.map((s) => {
    return (
      <StaffPopover
        key={s._id}
        staff={s}
        productId={productId}
        toggleShowStaff={setShowStaff}></StaffPopover>
    );
  });

  return <Stack>{staffer}</Stack>;
};

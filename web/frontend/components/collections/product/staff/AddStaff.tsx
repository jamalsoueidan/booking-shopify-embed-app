import { Stack } from '@shopify/polaris';
import useSWR from 'swr';
import { useAuthenticatedFetch } from '@hooks/useAuthenticatedFetch';
import StaffPopover from './AddStaff/StaffPopover';
import { useCollectionProductStaffToAdd } from '@services/product/staff';

export default ({
  productId,
  setShowStaff,
}: {
  productId: string;
  setShowStaff: any;
}) => {
  const fetch = useAuthenticatedFetch();
  const { data: staff } = useCollectionProductStaffToAdd({ productId });

  if (!staff) {
    return <>Loading...</>;
  }

  if (staff.length === 0) {
    return <>Du har allerede tilføjet alle brugere</>;
  }

  const staffer = staff?.map((s) => {
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

import { useCollectionProductStaff } from '@services/product/staff';
import { Stack } from '@shopify/polaris';
import { useContext } from 'react';
import StaffPopover from './AddStaff/StaffPopover';
import FormContext from './FormContext';

export default ({
  productId,
  setShowStaff,
}: {
  productId: string;
  setShowStaff: any;
}) => {
  const { value } = useContext(FormContext);
  const { data: staff } = useCollectionProductStaff({ productId });

  if (!staff) {
    return <>Loading...</>;
  }

  if (staff.length === 0) {
    return <>Du har allerede tilføjet alle brugere</>;
  }

  const staffer = staff
    ?.filter((s) => !value.find((t) => t._id === s._id))
    .map((s) => {
      return (
        <StaffPopover
          key={s._id}
          staff={s}
          toggleShowStaff={setShowStaff}></StaffPopover>
      );
    });

  return <Stack>{staffer}</Stack>;
};

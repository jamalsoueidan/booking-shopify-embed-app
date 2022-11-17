import {
  useCollectionProductStaffDestroy,
  useCollectionProductStaffList,
} from '@services/product/staff';
import { Button, Stack } from '@shopify/polaris';
import { useCallback } from 'react';
import StaffAvatar from './StaffAvatar';

interface Props {
  productId: string;
  toggleAddStaff: any;
  canDelete: boolean;
  toggleCanDelete: any;
}
export default ({
  productId,
  toggleAddStaff,
  canDelete,
  toggleCanDelete,
}: Props) => {
  const { data: staffier } = useCollectionProductStaffList({ productId });
  const { destroy } = useCollectionProductStaffDestroy({ productId });

  const removeStaffProduct = useCallback(async (staffId: string) => {
    await destroy({ staffId });
    toggleCanDelete(false);
  }, []);

  if (!staffier) {
    return <>Loading...</>;
  }

  const staffierMarkup = staffier?.map((staff) => (
    <Stack spacing="loose" key={staff._id}>
      <StaffAvatar fullname={staff.fullname}>
        {canDelete && (
          <div
            style={{ textAlign: 'center' }}
            onClick={() => removeStaffProduct(staff._id)}>
            <Button size="slim" destructive>
              Fjern
            </Button>
          </div>
        )}
      </StaffAvatar>
    </Stack>
  ));

  return (
    <Stack spacing="loose">
      {staffierMarkup}
      {!canDelete && (
        <span style={{ cursor: 'pointer' }} onClick={toggleAddStaff}>
          <StaffAvatar fullname="Add" />
        </span>
      )}
    </Stack>
  );
};

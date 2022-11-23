import { useCollectionProductStaffList } from '@services/product/staff';
import { Button, Stack } from '@shopify/polaris';
import { useCallback, useContext } from 'react';
import FormContext from './FormContext';
import StaffAvatar from './StaffAvatar';

interface Props {
  toggleAddStaff: any;
  canDelete: boolean;
  toggleCanDelete: any;
}
export default ({ toggleAddStaff, canDelete, toggleCanDelete }: Props) => {
  const { value: staffier, removeItem } = useContext(FormContext);

  const removeStaffProduct = useCallback((staff: any) => {
    removeItem(staff);
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
            onClick={() => removeStaffProduct(staff)}>
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

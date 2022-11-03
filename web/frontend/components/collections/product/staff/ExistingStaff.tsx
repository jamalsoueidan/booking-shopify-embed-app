import { Button, Stack } from '@shopify/polaris';
import useSWR, { useSWRConfig } from 'swr';
import StaffAvatar from './StaffAvatar';
import { useAuthenticatedFetch } from '../../../../hooks';
import { useCallback } from 'react';

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
  const { mutate } = useSWRConfig();
  const fetch = useAuthenticatedFetch();

  const { data: staffier } = useSWR<ProductStaffApi>(
    `/api/admin/products/${productId}/staff`,
    (apiURL: string) => fetch(apiURL).then((res: Response) => res.json())
  );

  const removeStaffProduct = useCallback(async (staff: string) => {
    await fetch(`/api/admin/products/${productId}/staff/${staff}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    await mutate(`/api/admin/products/${productId}/staff`);
    await mutate(`/api/admin/products/${productId}/staff-to-add`);
    toggleCanDelete(false);
  }, []);

  if (!staffier) {
    return <>Loading...</>;
  }

  const staffierMarkup = staffier?.payload?.map((staff) => (
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

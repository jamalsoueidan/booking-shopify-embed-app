import { ActionList, Popover } from '@shopify/polaris';
import { useCallback, useState } from 'react';
import { useSWRConfig } from 'swr';
import { useAuthenticatedFetch } from '@hooks/useAuthenticatedFetch';
import StaffAvatar from '../StaffAvatar';

export default ({
  staff,
  productId,
  toggleShowStaff,
}: {
  staff: ProductStaffToAdd;
  productId: string;
  toggleShowStaff: any;
}) => {
  const [popoverActive, setPopoverActive] = useState(false);

  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    []
  );

  const fetch = useAuthenticatedFetch();
  const { mutate } = useSWRConfig();

  const addNewStaffProduct = useCallback(async (staff: string, tag: string) => {
    await fetch(`/api/admin/products/${productId}/staff`, {
      method: 'POST',
      body: JSON.stringify({ staff, tag }),
      headers: { 'Content-Type': 'application/json' },
    });
    mutate(`/api/admin/products/${productId}/staff`);
    mutate(`/api/admin/products/${productId}/staff-to-add`);
  }, []);

  const handleAction = (tag: string) => async () => {
    togglePopoverActive();
    await addNewStaffProduct(staff._id, tag);
    toggleShowStaff();
  };

  const avatar = (
    <div
      style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
      onClick={togglePopoverActive}>
      <StaffAvatar fullname={staff.fullname} />
    </div>
  );

  const tags = staff.tags?.map((t) => ({
    content: t,
    onAction: handleAction(t),
  }));

  return (
    <Popover
      active={popoverActive}
      activator={avatar}
      autofocusTarget="first-node"
      onClose={togglePopoverActive}>
      <ActionList actionRole="menuitem" items={tags} />
    </Popover>
  );
};

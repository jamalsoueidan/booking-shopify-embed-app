import { useCollectionProductStaffCreate } from '@services/product/staff';
import { ActionList, Popover } from '@shopify/polaris';
import { useCallback, useState } from 'react';
import StaffAvatar from '../StaffAvatar';

const options = [
  { label: 'Green', value: '#4b6043' },
  { label: 'Blue', value: '#235284' },
  { label: 'Orange', value: '#d24e01' },
  { label: 'Purple', value: '#4c00b0' },
];

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

  const { create: addNewStaffProduct } = useCollectionProductStaffCreate({
    productId,
  });

  const handleAction = (tag: string) => async () => {
    togglePopoverActive();
    await addNewStaffProduct({ staffId: staff._id, tag });
    toggleShowStaff();
  };

  const avatar = (
    <div
      style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
      onClick={togglePopoverActive}>
      <StaffAvatar fullname={staff.fullname} />
    </div>
  );

  const IconContent = (t?: string) => () => {
    return (
      <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="10" fill={t} />
        <circle cx="10" cy="10" r="6" fill={t} />
        <circle cx="10" cy="10" r="3" />
      </svg>
    );
  };

  const tags = staff.tags?.map((t) => ({
    icon: IconContent(t),
    content: options.find((o) => o.value === t).label,
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

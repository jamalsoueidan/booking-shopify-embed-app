import TagOptions from '@components/staff/TagOptions';
import { ActionList, Popover } from '@shopify/polaris';
import { useCallback, useContext, useState } from 'react';
import FormContext from '../FormContext';
import StaffAvatar from '../StaffAvatar';

export default ({
  staff,
  toggleShowStaff,
}: {
  staff: ProductStaffToAdd;
  toggleShowStaff: any;
}) => {
  const { addItem } = useContext(FormContext);

  const [popoverActive, setPopoverActive] = useState(false);

  const togglePopoverActive = useCallback(
    () => setPopoverActive((popoverActive) => !popoverActive),
    []
  );

  const handleAction = useCallback(
    (tag: string) => () => {
      togglePopoverActive();
      addItem({ ...staff, tag });
      toggleShowStaff();
    },
    []
  );

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

  const tags = staff.tags.map((t) => ({
    icon: IconContent(t),
    content: TagOptions.find((o) => o.value === t).label,
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

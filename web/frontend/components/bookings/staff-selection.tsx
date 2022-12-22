import { useStaff } from '@services';
import { Avatar, Button, Stack } from '@shopify/polaris';
import { useTranslation } from '@hooks';
import { useCallback, useMemo } from 'react';

interface Props {
  staff: string;
  isLoading: boolean;
  onSelect: (value: string) => void;
}

export default ({ staff, onSelect, isLoading }: Props) => {
  const { data } = useStaff();
  const { t } = useTranslation('bookings');

  const onClick = useCallback(() => {
    onSelect(null);
  }, [onSelect]);

  const buttons = useMemo(
    () =>
      data?.map((s) => (
        <StaffButton
          key={s._id}
          selectedStaff={staff}
          onSelect={onSelect}
          staff={s}
          isLoading={isLoading}
        />
      )),
    [data]
  );

  if (!data) {
    return <></>;
  }

  return (
    <Stack>
      <Button
        icon={<Avatar size="medium" />}
        size="large"
        onClick={onClick}
        pressed={staff === null}
        loading={staff === null ? isLoading : false}>
        {t('all')}
      </Button>
      {buttons}
    </Stack>
  );
};

interface StaffButton {
  selectedStaff: string;
  staff: Staff;
  onSelect: (value: string) => void;
  isLoading?: boolean;
}

const StaffButton = ({
  selectedStaff,
  staff,
  onSelect,
  isLoading,
}: StaffButton) => {
  const onClick = useCallback(() => onSelect(staff._id), [onSelect]);

  return (
    <Button
      size="large"
      key={staff._id}
      onClick={onClick}
      pressed={selectedStaff === staff._id}
      loading={selectedStaff === staff._id ? isLoading : false}
      icon={
        <Avatar size="medium" name={staff.fullname} source={staff.avatar} />
      }>
      {staff.fullname}
    </Button>
  );
};

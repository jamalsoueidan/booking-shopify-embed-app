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
  if (!data) {
    return <></>;
  }

  const onClick = useCallback(() => {
    onSelect(null);
  }, [onSelect]);

  const buttons = useMemo(() => {
    data.map((s) => {
      const onClickUser = useCallback(() => onSelect(s._id), [onSelect]);
      return (
        <Button
          size="large"
          key={s._id}
          onClick={onClickUser}
          pressed={staff === s._id}
          loading={staff === s._id ? isLoading : false}
          icon={<Avatar size="medium" name={s.fullname} source={s.avatar} />}>
          {s.fullname}
        </Button>
      );
    });
  }, [data]);

  return (
    <Stack>
      <>
        <Button
          icon={<Avatar size="medium" />}
          size="large"
          onClick={onClick}
          pressed={staff === null}
          loading={staff === null ? isLoading : false}>
          {t('all')}
        </Button>
        {buttons}
      </>
    </Stack>
  );
};

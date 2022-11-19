import { useStaffList } from '@services/staff';
import { Button, Stack } from '@shopify/polaris';

interface Props {
  staff: string;
  isLoading: boolean;
  onSelect: (value: string) => void;
}
export default ({ staff, onSelect, isLoading }: Props) => {
  const { data } = useStaffList();
  if (!data) {
    return <></>;
  }

  return (
    <Stack>
      <Button
        onClick={() => onSelect(null)}
        pressed={staff === null}
        loading={staff === null ? isLoading : false}>
        All
      </Button>
      {data.map((s) => {
        return (
          <Button
            key={s._id}
            onClick={() => onSelect(s._id)}
            pressed={staff === s._id}
            loading={staff === s._id ? isLoading : false}>
            {s.fullname}
          </Button>
        );
      })}
    </Stack>
  );
};

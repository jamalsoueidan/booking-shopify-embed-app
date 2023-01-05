import { useWidgetStaff } from '@services/widget';
import { Select } from '@shopify/polaris';
import { Field } from '@shopify/react-form';
import { useMemo } from 'react';

interface ScheduleStaffSelectProps {
  productId: number;
  field: Field<string>;
}

export const ScheduleStaffSelect = ({
  productId,
  field,
}: ScheduleStaffSelectProps) => {
  const { data } = useWidgetStaff({ productId });

  const options = useMemo(() => {
    const all =
      data
        ?.map((o) => ({
          key: o.staff,
          label: o.fullname,
          value: o.staff,
        }))
        .sort(sortByName) || [];

    return [{ key: '-', label: 'Vælg medarbejder', value: '' }, ...all];
  }, [data]);

  return (
    <Select
      label="Vælg medarbejder"
      options={options}
      disabled={options.length === 1}
      {...field}
    />
  );
};

const sortByName = (a: any, b: any) => {
  if (a.label < b.label) {
    return -1;
  }
  if (a.label > b.label) {
    return 1;
  }
  return 0;
};

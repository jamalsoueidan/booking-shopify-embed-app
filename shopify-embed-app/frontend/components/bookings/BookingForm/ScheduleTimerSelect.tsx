import { useDate } from '@hooks/useDate';
import { useWidgetDate } from '@services/widget';
import { Select, SelectOption } from '@shopify/polaris';
import { Field } from '@shopify/react-form';
import { format } from 'date-fns';
import { useCallback, useMemo } from 'react';

interface ScheduleTimerSelectProps {
  date: Date;
  productId: number;
  staff: string;
  field: Field<{ start: string; end: string }>;
}

const defaultOption: SelectOption = {
  key: 'vælg tid',
  label: 'Vælg tid',
  value: null,
} as any;

export const ScheduleTimerSelect = ({
  date,
  staff,
  productId,
  field,
}: ScheduleTimerSelectProps) => {
  const selectedDate = date ? format(new Date(date), 'yyyy-MM-dd') : null;
  const { toTimeZone } = useDate();

  const { data } = useWidgetDate({
    productId: productId,
    staff: staff,
    start: selectedDate,
    end: selectedDate,
  });

  const timeOptions = useMemo(() => {
    if (!data || !date) {
      return [defaultOption];
    }

    const schedule = data.find(
      (s) => s.date === format(new Date(date), 'yyyy-MM-dd')
    );

    const hours =
      schedule?.hours.map((t) => ({
        label:
          format(toTimeZone(t.start), 'HH:mm') +
          ' - ' +
          format(toTimeZone(t.end), 'HH:mm'),
        value: t.start,
      })) || [];

    hours.sort(sortByDate);

    return [defaultOption, ...hours];
  }, [data]);

  const onChange = useCallback(
    (selected: string) => {
      const schedule = data.find(
        (s) => s.date === format(new Date(date), 'yyyy-MM-dd')
      );

      const selectedHour = schedule?.hours.find((t) => t.start === selected);

      field.onChange({
        start: selectedHour.start,
        end: selectedHour.end,
      });
    },
    [field.onChange, data]
  );

  return (
    <Select
      label="Tid"
      options={timeOptions}
      value={field.value?.start}
      disabled={timeOptions.length <= 1}
      onChange={onChange}
      onBlur={field.onBlur}
      error={field.error}
    />
  );
};

const sortByDate = function (a: any, b: any) {
  const dateA = new Date(a.value);
  const dateB = new Date(b.value);

  if (dateA < dateB) {
    return -1;
  }
  if (dateA > dateB) {
    return 1;
  }
  return 0;
};

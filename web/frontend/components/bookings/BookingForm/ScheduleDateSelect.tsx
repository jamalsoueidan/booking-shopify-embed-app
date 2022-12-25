import { useWidgetDate } from '@services/widget';
import { DatePicker, Range, Stack, Text } from '@shopify/polaris';
import { Field } from '@shopify/react-form';
import { eachDayOfInterval, endOfMonth, format, subDays } from 'date-fns';
import { useCallback, useMemo, useState } from 'react';

interface DatePickerState {
  month: number;
  year: number;
}

interface ScheduleDateSelectProps {
  productId: number;
  staff: string;
  field: Field<Date>;
}

export const ScheduleDateSelect = ({
  field,
  staff,
  productId,
}: ScheduleDateSelectProps) => {
  const defaultDate = field.value ? new Date(field.value) : new Date();

  const [{ month, year }, setDate] = useState<DatePickerState>({
    month: defaultDate.getMonth(),
    year: defaultDate.getFullYear(),
  });

  const { data } = useWidgetDate({
    productId,
    staff,
    start: format(new Date(year, month, 1), 'yyyy-MM-dd'),
    end: format(endOfMonth(new Date(year, month)), 'yyyy-MM-dd'),
  });

  const handleMonthChange = useCallback(
    (month: number, year: number) => setDate({ month, year }),
    []
  );

  const onChange = useCallback((date: Range) => field.onChange(date.start), []);

  const disableSpecificDates = useMemo(() => {
    const dayIntervals = eachDayOfInterval({
      start: new Date(year, month),
      end: endOfMonth(new Date(year, month)),
    });

    return dayIntervals.filter(
      (r) => !data?.find((s) => s.date === format(r, 'yyyy-MM-dd'))
    );
  }, [data, year, month]);

  return (
    <Stack vertical spacing="tight">
      <Text variant="bodyMd" as="p">
        Vælge dato
      </Text>

      <DatePicker
        month={month}
        year={year}
        onMonthChange={handleMonthChange}
        selected={defaultDate}
        onChange={onChange}
        weekStartsOn={1}
        disableDatesBefore={subDays(new Date(), 1)}
        disableSpecificDates={disableSpecificDates}
      />
    </Stack>
  );
};

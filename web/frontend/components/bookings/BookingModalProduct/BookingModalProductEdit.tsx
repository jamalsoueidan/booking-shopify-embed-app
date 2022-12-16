import FormErrors from '@components/FormErrors';
import LoadingSpinner from '@components/LoadingSpinner';
import useCustomForm from '@hooks/useCustomForm';
import { useDate } from '@hooks/useDate';
import { useBookingUpdate } from '@services/bookings';
import { useWidgetDate, useWidgetStaff } from '@services/widget';
import {
  DatePicker,
  Form,
  FormLayout,
  Modal,
  Range,
  Select,
  SelectOption,
  Text,
} from '@shopify/polaris';
import { notEmpty, useField } from '@shopify/react-form';
import { eachDayOfInterval, endOfMonth, format } from 'date-fns';
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';

const sortByDate = function (a: any, b: any) {
  var dateA = new Date(a.value);
  var dateB = new Date(b.value);

  if (dateA < dateB) {
    return -1;
  }
  if (dateA > dateB) {
    return 1;
  }
  return 0;
};

export default forwardRef(({ info }: BookingModalChildProps, ref) => {
  const startDate = new Date(info.start);

  const { toTimeZone } = useDate();

  const [{ month, year }, setDate] = useState<{
    month: number;
    year: number;
  }>({
    month: startDate.getMonth(),
    year: startDate.getFullYear(),
  });

  const handleMonthChange = useCallback(
    (month: number, year: number) => setDate({ month, year }),
    []
  );

  const { data: staffOptions } = useWidgetStaff({
    productId: info.productId,
  });
  const { update } = useBookingUpdate({ id: info._id });

  const { validate, fields, submit, submitErrors, isSubmitted, isValid } =
    useCustomForm({
      fields: {
        staff: useField({
          value: info.staff._id || '',
          validates: [notEmpty('to is required')],
        }),
        date: useField({
          value: startDate || undefined,
          validates: [notEmpty('message is required')],
        }),
        time: useField({
          value: info.start || undefined,
          validates: [notEmpty('time is required')],
        }),
      },
      onSubmit: async (fieldValues) => {
        const schedule = dateOptions?.find(
          (s) => s.date === format(fieldValues.date, 'yyyy-MM-dd')
        );

        const hour = schedule.hours.find((h) => h.start === fieldValues.time);

        await update({
          start: hour.start,
          end: hour.end,
          staff: hour.staff._id,
        });

        return { status: 'success' };
      },
    });

  useImperativeHandle(
    ref,
    () => ({
      submit() {
        submit();
        return validate().length == 0;
      },
    }),
    []
  );

  const { data: dateOptions } = useWidgetDate({
    productId: info.productId,
    staff: fields.staff.value,
    start: format(new Date(year, month, 1), 'yyyy-MM-dd'),
    end: format(endOfMonth(new Date(year, month)), 'yyyy-MM-dd'),
  });

  const onDateChange = useCallback(
    (date: Range) => fields.date.onChange(date.start),
    []
  );

  const disableSpecificDates = useMemo(() => {
    const dayIntervals = eachDayOfInterval({
      start: new Date(year, month, 1),
      end: endOfMonth(new Date(year, month)),
    });

    return dayIntervals.filter(
      (r) => !dateOptions?.find((s) => s.date === format(r, 'yyyy-MM-dd'))
    );
  }, [dateOptions]);

  const timeOptions = useMemo(() => {
    const defaultOption: SelectOption = {
      label: 'Vælge tid',
      value: undefined,
      disabled: true,
    };

    const schedule = dateOptions?.find(
      (s) => s.date === format(fields.date.value, 'yyyy-MM-dd')
    );

    const hours = schedule?.hours.map((t) => ({
      label:
        format(toTimeZone(t.start as any), 'HH:mm') +
        ' - ' +
        format(toTimeZone(t.end as any), 'HH:mm'),
      value: t.start,
    }));

    // if set same date as info.start, select info.start as default
    if (schedule?.date === format(startDate, 'yyyy-MM-dd')) {
      fields.time.onChange(info.start);
      return [
        defaultOption,
        {
          label:
            format(toTimeZone(info.start), 'HH:mm') +
            ' - ' +
            format(toTimeZone(info.end), 'HH:mm'),
          value: info.start.toString(),
        },
        ...hours,
      ].sort(sortByDate);
    } else if (hours) {
      fields.time.onChange(undefined);
      return [defaultOption, ...hours];
    } else {
      // hours is empty
      fields.time.onChange(undefined);
      return [];
    }
  }, [fields.date.value, dateOptions]);

  if (!staffOptions) {
    return (
      <Modal.Section>
        <LoadingSpinner />
      </Modal.Section>
    );
  }

  if (staffOptions.length === 0) {
    return (
      <Modal.Section>
        <Text variant="bodyMd" as="p">
          Der er ingen medarbejder længere tilknyttet til dette produkt, gå til
          produkt og tilføj medarbejder.
        </Text>
      </Modal.Section>
    );
  }

  return (
    <Form onSubmit={() => null}>
      <Modal.Section>
        <FormLayout>
          {isSubmitted && !isValid && <FormErrors errors={submitErrors} />}
          <Select
            label="Vælg medarbejder"
            options={
              staffOptions?.map((o) => ({
                label: o.fullname,
                value: o.staff,
              })) || []
            }
            {...fields.staff}
          />
          <Text variant="bodyMd" as="p">
            Vælge dato
          </Text>
          <DatePicker
            month={month}
            year={year}
            onMonthChange={handleMonthChange}
            selected={fields.date.value}
            onChange={onDateChange}
            disableSpecificDates={disableSpecificDates}
          />
          {timeOptions?.length > 0 && (
            <Select
              label="Tid"
              options={timeOptions}
              {...fields.time}
              disabled={!fields.date.value}
            />
          )}
          <Text variant="bodyMd" as="p" color="critical">
            ATTENTION: When you update this booking it will not update with the
            order data anymore.
          </Text>
        </FormLayout>
      </Modal.Section>
    </Form>
  );
});

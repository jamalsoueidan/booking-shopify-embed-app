import FormErrors from '@components/FormErrors';
import useCustomForm from '@hooks/useCustomForm';
import { useBookingUpdate } from '@services/bookings';
import { useSettingGet } from '@services/setting';
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
import { utcToZonedTime } from 'date-fns-tz';
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';

export default forwardRef(({ info }: BookingModalChildProps, ref) => {
  const startDate = new Date(info.start);

  const [{ month, year }, setDate] = useState<{ month: number; year: number }>({
    month: startDate.getMonth(),
    year: startDate.getFullYear(),
  });

  const handleMonthChange = useCallback(
    (month: number, year: number) => setDate({ month, year }),
    []
  );

  const { data: settings } = useSettingGet();
  const { data: staffOptions } = useWidgetStaff({ productId: info.productId });
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

  useImperativeHandle(ref, () => ({
    submit() {
      submit();
      return validate().length == 0;
    },
  }));

  const { data: dateOptions } = useWidgetDate({
    productId: info.productId,
    staff: fields.staff.value,
    start: new Date(year, month, 1),
    end: endOfMonth(new Date(year, month)),
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
    };

    const schedule = dateOptions?.find(
      (s) => s.date === format(fields.date.value, 'yyyy-MM-dd')
    );

    const hours = schedule?.hours.map((t) => ({
      label:
        format(utcToZonedTime(t.start, settings.timeZone), 'HH:mm') +
        ' - ' +
        format(utcToZonedTime(t.end, settings.timeZone), 'HH:mm'),
      value: t.start,
    }));

    // if set same date as info.start, select info.start as default
    if (schedule?.date === format(startDate, 'yyyy-MM-dd')) {
      fields.time.onChange(info.start);
      return [
        defaultOption,
        {
          label:
            format(new Date(info.start), 'HH:mm') +
            ' - ' +
            format(new Date(info.end), 'HH:mm'),
          value: info.start.toString(),
        },
        ...hours,
      ];
    } else if (hours) {
      fields.time.onChange(undefined);
      return [defaultOption, ...hours];
    } else {
      // hours is empty
      fields.time.onChange(undefined);
      return [];
    }
  }, [fields.date.value, dateOptions]);

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

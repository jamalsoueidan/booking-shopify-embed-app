import { useDate, useTagOptions } from '@hooks';
import isSelectedDays from '@libs/validators/isSelectedDays';
import { useStaffScheduleCreate } from '@services';
import {
  Columns,
  DatePicker,
  Layout,
  Modal,
  Select,
  TextField,
} from '@shopify/polaris';
import { useField, useForm } from '@shopify/react-form';
import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getMonth,
  getYear,
  subDays,
} from 'date-fns';
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SelectDays } from './SelectDays';

interface CreateDayScheduleProps {
  date: string;
  close: (value: null) => void;
}

export default forwardRef(({ date, close }: CreateDayScheduleProps, ref) => {
  const { options } = useTagOptions();
  const params = useParams();
  const [{ month, year }, setDate] = useState({
    month: getMonth(new Date(date)) - 1,
    year: getYear(new Date(date)),
  });

  const [selectedDates, setSelectedDates] = useState({
    start: new Date(date),
    end: endOfMonth(new Date(date)),
  });

  const { toUtc } = useDate();

  const { create } = useStaffScheduleCreate({
    staff: params.id,
  });

  const { fields, submit, validate } = useForm({
    fields: {
      days: useField({
        value: [format(new Date(date), 'EEEE').toLowerCase()],
        validates: [isSelectedDays('You must select atleast one day')],
      }),
      startTime: useField({
        value: '09:00',
        validates: [],
      }),
      endTime: useField({
        value: '16:00',
        validates: [],
      }),
      tag: useField({
        value: options[0].value,
        validates: [],
      }),
      available: useField({
        value: true,
        validates: [],
      }),
    },
    onSubmit: async (fieldValues) => {
      const result = eachDayOfInterval(selectedDates);
      const daysToFilterFor = result.filter((r) =>
        fieldValues.days.includes(format(r, 'EEEE').toLowerCase())
      );

      const getZonedTime = (date: Date, time: string) =>
        toUtc(`${format(date, 'yyyy-MM-dd')} ${time}:00`).toISOString();

      const body = daysToFilterFor.map((date) => {
        return {
          start: getZonedTime(date, fieldValues.startTime),
          end: getZonedTime(date, fieldValues.endTime),
          available: true,
          tag: fieldValues.tag,
        };
      });
      await create(body);
      close(null);

      return { status: 'success' };
    },
  });

  useImperativeHandle(ref, () => ({
    submit() {
      submit();
      return validate().length == 0;
    },
  }));

  const handleMonthChange = useCallback(
    (month: number, year: number) => setDate({ month, year }),
    []
  );

  return (
    <Modal.Section>
      <Layout>
        <Layout.Section>
          <SelectDays days={fields.days}></SelectDays>
        </Layout.Section>
        <Layout.Section>
          <DatePicker
            month={month}
            year={year}
            onChange={setSelectedDates}
            onMonthChange={handleMonthChange}
            selected={selectedDates}
            multiMonth
            allowRange
            disableDatesBefore={subDays(new Date(), 1)}
          />
        </Layout.Section>
        <Layout.Section>
          <Columns
            columns={{
              xs: '3fr 3fr',
              md: '3fr 3fr',
            }}>
            <TextField
              label="Tid fra"
              type="time"
              autoComplete="off"
              {...fields.startTime}
            />
            <TextField
              label="Tid til"
              type="time"
              autoComplete="off"
              {...fields.endTime}
            />
          </Columns>
        </Layout.Section>
        <Layout.Section>
          <Select label="Tag" options={options} {...fields.tag} />
        </Layout.Section>
      </Layout>
    </Modal.Section>
  );
});

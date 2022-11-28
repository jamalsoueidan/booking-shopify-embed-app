import useTagOptions from '@components/useTagOptions';
import { useSettingGet } from '@services/setting';
import { useStaffScheduleCreate } from '@services/staff/schedule';
import {
  Card,
  Columns,
  DatePicker,
  Layout,
  Modal,
  Select,
  TextField,
} from '@shopify/polaris';
import { useField, useForm } from '@shopify/react-form';
import {
  addDays,
  addHours,
  eachDayOfInterval,
  format,
  getMonth,
  getYear,
  isAfter,
  isBefore,
  subDays,
  subHours,
} from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import da from 'date-fns/locale/da';
import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';
import { useParams } from 'react-router-dom';

interface CreateDayScheduleProps {
  date: string;
  close: (value: null) => void;
}

export default forwardRef(({ date, close }: CreateDayScheduleProps, ref) => {
  const tagOptions = useTagOptions();
  const params = useParams();
  const [{ month, year }, setDate] = useState({
    month: getMonth(new Date(date)),
    year: getYear(new Date(date)),
  });

  const [selectedDates, setSelectedDates] = useState({
    start: new Date(date),
    end: addDays(new Date(), 24),
  });

  const { data: settings } = useSettingGet();

  const { create } = useStaffScheduleCreate({
    userId: params.id,
  });

  const { fields, submit, submitting } = useForm({
    fields: {
      startTime: useField({
        value: '09:00',
        validates: [],
      }),
      endTime: useField({
        value: '16:00',
        validates: [],
      }),
      tag: useField({
        value: tagOptions[0].value,
        validates: [],
      }),
      available: useField({
        value: true,
        validates: [],
      }),
    },
    onSubmit: async (fieldValues) => {
      const result = eachDayOfInterval(selectedDates);
      const daysToFilterFor = result.filter(
        (r) => format(r, 'EEEE') === format(new Date(date), 'EEEE')
      );

      let startDateTime = zonedTimeToUtc(
        `${format(daysToFilterFor[0], 'yyyy-MM-dd')} ${
          fieldValues.startTime
        }:00`,
        settings.timeZone
      );
      let endDateTime = zonedTimeToUtc(
        `${format(daysToFilterFor[0], 'yyyy-MM-dd')} ${fieldValues.endTime}:00`,
        settings.timeZone
      );

      const body = Array(daysToFilterFor.length) //5 weeks create groupID
        .fill(0)
        .map((_, index) => {
          let start = addDays(startDateTime, 7 * index);
          let end = addDays(endDateTime, 7 * index);

          // summer time ends
          if (
            isBefore(startDateTime, new Date(start.getFullYear(), 9, 30)) &&
            isAfter(start, new Date(start.getFullYear(), 9, 30)) // 9 is for october
          ) {
            start = addHours(start, 1);
            end = addHours(end, 1);
          }

          // summer time starts
          if (
            isBefore(startDateTime, new Date(start.getFullYear(), 2, 27)) &&
            isAfter(start, new Date(start.getFullYear(), 2, 27)) // 2 is for march
          ) {
            start = subHours(start, 1);
            end = subHours(end, 1);
          }

          return {
            start: start.toISOString(),
            end: end.toISOString(),
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
          <Card>
            <Card.Section>
              Alle{' '}
              <strong>{format(new Date(date), 'EEEE', { locale: da })}</strong>{' '}
              arbejdsdag fra{' '}
              <strong>
                {format(new Date(selectedDates.start), 'dd/MM/yyyy', {
                  locale: da,
                })}
              </strong>{' '}
              til og med{' '}
              <strong>
                {format(new Date(selectedDates.end), 'dd/MM/yyyy', {
                  locale: da,
                })}
              </strong>
            </Card.Section>
          </Card>
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
          <Select label="Tag" options={tagOptions} {...fields.tag} />
        </Layout.Section>
      </Layout>
    </Modal.Section>
  );
});

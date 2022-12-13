import useTagOptions from '@components/useTagOptions';
import { useSettingGet } from '@services/setting';
import { useStaffScheduleCreate } from '@services/staff/schedule';
import {
  Card,
  Columns,
  Layout,
  Modal,
  Select,
  TextField,
} from '@shopify/polaris';
import { useField, useForm } from '@shopify/react-form';
import { format } from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import da from 'date-fns/locale/da';
import { forwardRef, useImperativeHandle } from 'react';
import { useParams } from 'react-router-dom';

interface CreateDayScheduleProps {
  date: string;
  close: (value: null) => void;
}

export default forwardRef(({ date, close }: CreateDayScheduleProps, ref) => {
  const { options } = useTagOptions();
  const params = useParams();
  const { data: settings } = useSettingGet();

  const { create: createSchedule } = useStaffScheduleCreate({
    staff: params.id,
  });

  const { fields, submit, validate } = useForm({
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
        value: options[0].value,
        validates: [],
      }),
      available: useField({
        value: true,
        validates: [],
      }),
    },
    onSubmit: async (fieldValues) => {
      const start = zonedTimeToUtc(
        `${date} ${fieldValues.startTime}`,
        settings.timeZone
      );
      const end = zonedTimeToUtc(
        `${date} ${fieldValues.endTime}`,
        settings.timeZone
      );

      const body = {
        start: start.toISOString(),
        end: end.toISOString(),
        available: fieldValues.available,
        tag: fieldValues.tag,
      };

      await createSchedule(body);
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

  return (
    <Modal.Section>
      <Layout>
        <Layout.Section>
          <Card>
            <Card.Section>
              Arbejdsdag{' '}
              <strong>{format(new Date(date), 'EEEE', { locale: da })}</strong>{' '}
              og dato <strong>{date}</strong>
            </Card.Section>
          </Card>
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

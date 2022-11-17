import {
  Button,
  Checkbox,
  Layout,
  Modal,
  Select,
  TextField,
} from '@shopify/polaris';
import { format } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import useSetting from '../../services/setting';
import {
  useStaffScheduleDestroy,
  useStaffScheduleUpdate,
} from '../../services/staff/schedule';

interface Props {
  info: any;
  setInfo: any;
}

const options = [
  { label: 'Green', value: '#4b6043' },
  { label: 'Blue', value: '#235284' },
  { label: 'Orange', value: '#d24e01' },
  { label: 'Purple', value: '#4c00b0' },
];

export default ({ info, setInfo }: Props) => {
  const params = useParams();
  const toggleActive = () => setInfo(null);
  const { data: settings } = useSetting();
  const toTimeZone = (fromUTC: Date) =>
    utcToZonedTime(fromUTC, settings.timeZone);

  const extendedProps = info.event._def.extendedProps;
  const [startTime, setStartTime] = useState<string>(
    format(toTimeZone(extendedProps.start), 'HH:mm')
  );
  const [endTime, setEndTime] = useState<string>(
    format(toTimeZone(extendedProps.end), 'HH:mm')
  );
  const [tag, setTag] = useState(extendedProps.tag || options[0].value);
  const [available, setAvailable] = useState(extendedProps.available || false);

  const { isUpdating, update: updateSchedule } = useStaffScheduleUpdate({
    userId: params.id,
    scheduleId: extendedProps._id,
  });

  const { isUpdating: isUpdatingAll, update: updateScheduleAll } =
    useStaffScheduleUpdate({
      userId: params.id,
      scheduleId: extendedProps._id,
    });

  const { isDestroying, destroy: destroySchedule } = useStaffScheduleDestroy({
    userId: params.id,
    scheduleId: extendedProps._id,
  });

  const { isDestroying: isDestroyingAll, destroy: destroyScheduleAll } =
    useStaffScheduleDestroy({
      userId: params.id,
      scheduleId: extendedProps._id,
    });

  const handleStart = (value: string) => setStartTime(value);
  const handleTag = (value: string) => setTag(value);
  const handleAvailable = (newChecked: boolean) => setAvailable(newChecked);
  const handleEnd = (value: string) => setEndTime(value);

  const updateDate = async (type: 'all' | null) => {
    const start = zonedTimeToUtc(
      `${extendedProps.start.substr(0, 10)} ${startTime}`,
      settings.timeZone
    );
    const end = zonedTimeToUtc(
      `${extendedProps.end.substr(0, 10)} ${endTime}`,
      settings.timeZone
    );

    const body: Omit<Schedule, '_id' | 'staff'> = {
      start: start.toISOString(),
      end: end.toISOString(),
      available: true,
      tag,
      ...(type === 'all' ? { groupId: extendedProps.groupId } : null),
    };

    if (type == 'all') {
      await updateScheduleAll(body);
    } else {
      await updateSchedule(body);
    }
    setInfo(null);
  };

  const deleteDate = async (type: 'all' | null) => {
    const body = {
      ...(type === 'all' ? { groupId: extendedProps.groupId } : null),
    };

    if (type == 'all') {
      await destroyScheduleAll(body);
    } else {
      await destroySchedule(body);
    }
    setInfo(null);
  };

  const formatDate = format(new Date(extendedProps.start), 'MM/dd/yyyy');

  return (
    <Modal
      small
      open={true}
      onClose={toggleActive}
      title="Edit availability"
      secondaryActions={[
        {
          content: 'Luk',
          onAction: toggleActive,
        },
      ]}>
      <Modal.Section>{formatDate}</Modal.Section>
      <Modal.Section>
        <Layout>
          <Layout.Section oneThird>
            <TextField
              label="Tid fra"
              value={startTime}
              type="time"
              onChange={handleStart}
              autoComplete="off"
            />
          </Layout.Section>
          <Layout.Section>
            <TextField
              label="Tid til"
              value={endTime}
              type="time"
              onChange={handleEnd}
              autoComplete="off"
            />
          </Layout.Section>
          <Layout.Section>
            <Checkbox
              label="Available"
              checked={available}
              onChange={handleAvailable}
            />
          </Layout.Section>
          <Layout.Section>
            <Select
              label="Tag"
              options={options}
              onChange={handleTag}
              value={tag}
            />
          </Layout.Section>
          <Layout.Section>
            <Button
              primary
              onClick={() => updateDate(null)}
              loading={isUpdating}>
              Redigere pågældende
            </Button>
          </Layout.Section>
          <Layout.Section>
            <Button
              destructive
              onClick={() => deleteDate(null)}
              loading={isDestroying}>
              Slet pågældende
            </Button>
          </Layout.Section>
          {extendedProps.groupId && (
            <Layout.Section>
              <Button
                primary
                onClick={() => updateDate('all')}
                loading={isUpdatingAll}>
                Redigere alle
              </Button>
            </Layout.Section>
          )}
          {extendedProps.groupId && (
            <Layout.Section>
              <Button
                destructive
                onClick={() => deleteDate('all')}
                loading={isDestroyingAll}>
                Slet alle
              </Button>
            </Layout.Section>
          )}
        </Layout>
      </Modal.Section>
    </Modal>
  );
};

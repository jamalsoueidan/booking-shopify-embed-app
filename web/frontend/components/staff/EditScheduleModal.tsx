import { useDate, useTagOptions } from '@hooks';
import {
  useStaffScheduleDestroy,
  useStaffScheduleUpdate,
} from '@services';
import {
  Button,
  Checkbox,
  Layout,
  Modal,
  Select,
  TextField,
} from '@shopify/polaris';
import { format } from 'date-fns';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

interface Props {
  info: any;
  setInfo: any;
}

export default ({ info, setInfo }: Props) => {
  const { options } = useTagOptions();
  const params = useParams();
  const toggleActive = () => setInfo(null);
  const { toTimeZone, toUtc } = useDate();

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
    staff: params.id,
    schedule: extendedProps._id,
  });

  const { isUpdating: isUpdatingAll, update: updateScheduleAll } =
    useStaffScheduleUpdate({
      staff: params.id,
      schedule: extendedProps._id,
    });

  const { isDestroying, destroy: destroySchedule } = useStaffScheduleDestroy({
    staff: params.id,
    schedule: extendedProps._id,
  });

  const { isDestroying: isDestroyingAll, destroy: destroyScheduleAll } =
    useStaffScheduleDestroy({
      staff: params.id,
      schedule: extendedProps._id,
    });

  const handleStart = (value: string) => setStartTime(value);
  const handleTag = (value: string) => setTag(value);
  const handleAvailable = (newChecked: boolean) => setAvailable(newChecked);
  const handleEnd = (value: string) => setEndTime(value);

  const updateDate = async (type: 'all' | null) => {
    const start = toUtc(`${extendedProps.start.substr(0, 10)} ${startTime}`);
    const end = toUtc(`${extendedProps.end.substr(0, 10)} ${endTime}`);

    const body: ScheduleBody = {
      start: start.toISOString(),
      end: end.toISOString(),
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

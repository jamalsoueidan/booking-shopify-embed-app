import { useDate, useTagOptions } from '@hooks';
import { ScheduleBodyUpdate } from '@jamalsoueidan/bsb.mongodb.types';
import { useToast } from '@providers/toast';
import { useStaffScheduleDestroy, useStaffScheduleUpdate } from '@services';
import {
  Button,
  Checkbox,
  Layout,
  Modal,
  Select,
  TextField,
} from '@shopify/polaris';
import { format } from 'date-fns';
import { useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

interface Props {
  info: any;
  setInfo: any;
}

export default ({ info, setInfo }: Props) => {
  const { options } = useTagOptions();
  const params = useParams();
  const { show } = useToast();
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

  const handleStart = useCallback((value: string) => setStartTime(value), []);
  const handleTag = useCallback((value: string) => setTag(value), []);
  const handleAvailable = useCallback(
    (newChecked: boolean) => setAvailable(newChecked),
    []
  );
  const handleEnd = useCallback((value: string) => setEndTime(value), []);

  const updateDate = useCallback(
    async (type: 'all' | null) => {
      const start = toUtc(`${extendedProps.start.substr(0, 10)} ${startTime}`);
      const end = toUtc(`${extendedProps.end.substr(0, 10)} ${endTime}`);

      const body: ScheduleBodyUpdate = {
        start: start.toISOString(),
        end: end.toISOString(),
        tag,
        ...(type === 'all' ? { groupId: extendedProps.groupId } : null),
      };

      type == 'all' ? updateScheduleAll(body) : updateSchedule(body);
      setInfo(null);
      show({
        content:
          type === 'all'
            ? 'Schedules has been updated'
            : 'Schedule has been updated',
      });
    },
    [toUtc, updateSchedule, updateScheduleAll, setInfo]
  );

  const deleteDate = useCallback(
    (type: 'all' | null) => {
      const body = {
        ...(type === 'all' ? { groupId: extendedProps.groupId } : null),
      };

      type == 'all' ? destroyScheduleAll(body) : destroySchedule(body);
      setInfo(null);
      show({
        content:
          type === 'all' ? 'Schedules is deleted' : 'Schedule is deleted',
      });
    },
    [destroyScheduleAll, destroySchedule, setInfo]
  );

  const formatDate = format(new Date(extendedProps.start), 'MM/dd/yyyy');

  const secondaryActions = useMemo(
    () => [
      {
        content: 'Luk',
        onAction: toggleActive,
      },
    ],
    [toggleActive]
  );

  const onClose = useCallback(() => toggleActive(), [toggleActive]);

  const updateDateOne = useCallback(() => updateDate(null), [updateDate]);
  const deleteDateOne = useCallback(() => deleteDate(null), [deleteDate]);
  const updateDateAll = useCallback(() => updateDate('all'), [updateDate]);
  const deleteDateAll = useCallback(() => deleteDate('all'), [deleteDate]);

  return (
    <Modal
      small
      open={true}
      onClose={onClose}
      title="Edit availability"
      secondaryActions={secondaryActions}>
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
            <Button primary onClick={updateDateOne} loading={isUpdating}>
              Redigere pågældende
            </Button>
          </Layout.Section>
          <Layout.Section>
            <Button destructive onClick={deleteDateOne} loading={isDestroying}>
              Slet pågældende
            </Button>
          </Layout.Section>
          {extendedProps.groupId && (
            <Layout.Section>
              <Button primary onClick={updateDateAll} loading={isUpdatingAll}>
                Redigere alle
              </Button>
            </Layout.Section>
          )}
          {extendedProps.groupId && (
            <Layout.Section>
              <Button
                destructive
                onClick={deleteDateAll}
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

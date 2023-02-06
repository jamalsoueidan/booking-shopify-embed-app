import { Schedule, ScheduleBodyUpdate } from "@jamalsoueidan/bsb.mongodb.types";
import { useDate, useTag, useToast } from "@jamalsoueidan/bsf.bsf-pkg";
import {
  useStaffScheduleDestroy,
  useStaffScheduleUpdate,
} from "@services/staff/schedule";
import { Button, Layout, Modal, Select, TextField } from "@shopify/polaris";
import { format } from "date-fns";
import { useCallback, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

interface EditShiftModalProps {
  schedule: Schedule;
  close: () => void;
}

export const EditShiftModal = ({ schedule, close }: EditShiftModalProps) => {
  const { options } = useTag();
  const { show } = useToast();
  const { toTimeZone, toUtc } = useDate();
  const params = useParams();

  const [startTime, setStartTime] = useState<string>(
    format(toTimeZone(schedule.start), "HH:mm"),
  );
  const [endTime, setEndTime] = useState<string>(
    format(toTimeZone(schedule.end), "HH:mm"),
  );
  const [tag, setTag] = useState(schedule.tag || options[0].value);

  const { isUpdating, update: updateSchedule } = useStaffScheduleUpdate({
    schedule: schedule._id,
    staff: params.id,
  });

  const { isUpdating: isUpdatingAll, update: updateScheduleAll } =
    useStaffScheduleUpdate({
      schedule: schedule._id,
      staff: params.id,
    });

  const { isDestroying, destroy: destroySchedule } = useStaffScheduleDestroy({
    schedule: schedule._id,
    staff: params.id,
  });

  const { isDestroying: isDestroyingAll, destroy: destroyScheduleAll } =
    useStaffScheduleDestroy({
      schedule: schedule._id,
      staff: params.id,
    });

  const handleStart = useCallback((value: string) => setStartTime(value), []);
  const handleTag = useCallback((value: string) => setTag(value), []);
  const handleEnd = useCallback((value: string) => setEndTime(value), []);

  const updateDate = useCallback(
    async (type: "all" | null) => {
      const start = toUtc(
        `${schedule.start.toJSON().substr(0, 10)} ${startTime}`,
      );
      const end = toUtc(`${schedule.end.toJSON().substr(0, 10)} ${endTime}`);

      const body: ScheduleBodyUpdate = {
        end: end.toISOString(),
        start: start.toISOString(),
        tag,
        ...(type === "all" ? { groupId: schedule.groupId } : null),
      };

      type == "all" ? updateScheduleAll(body) : updateSchedule(body);
      close();
      show({
        content:
          type === "all"
            ? "Schedules has been updated"
            : "Schedule has been updated",
      });
    },
    [
      toUtc,
      schedule.start,
      schedule.end,
      schedule.groupId,
      startTime,
      endTime,
      tag,
      updateScheduleAll,
      updateSchedule,
      close,
      show,
    ],
  );

  const deleteDate = useCallback(
    (type: "all" | null) => {
      const body = {
        ...(type === "all" ? { groupId: schedule.groupId } : null),
      };

      type == "all" ? destroyScheduleAll(body) : destroySchedule(body);
      close();
      show({
        content:
          type === "all" ? "Schedules is deleted" : "Schedule is deleted",
      });
    },
    [schedule.groupId, destroyScheduleAll, destroySchedule, close, show],
  );

  const formatDate = format(new Date(schedule.start), "MM/dd/yyyy");

  const secondaryActions = useMemo(
    () => [
      {
        content: "Luk",
        onAction: close,
      },
    ],
    [close],
  );

  const updateDateOne = useCallback(() => updateDate(null), [updateDate]);
  const deleteDateOne = useCallback(() => deleteDate(null), [deleteDate]);
  const updateDateAll = useCallback(() => updateDate("all"), [updateDate]);
  const deleteDateAll = useCallback(() => deleteDate("all"), [deleteDate]);

  return (
    <Modal
      small
      open={true}
      onClose={close}
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
          {schedule.groupId && (
            <Layout.Section>
              <Button primary onClick={updateDateAll} loading={isUpdatingAll}>
                Redigere alle
              </Button>
            </Layout.Section>
          )}
          {schedule.groupId && (
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

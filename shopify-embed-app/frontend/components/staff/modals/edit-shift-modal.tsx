import { Schedule, Tag } from "@jamalsoueidan/pkg.bsb-types";
import { useDate, useTag, useToast } from "@jamalsoueidan/pkg.bsf";
import {
  useStaffScheduleDestroy,
  useStaffScheduleDestroyGroup,
  useStaffScheduleUpdate,
  useStaffScheduleUpdateGroup,
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
  const { toTimeZone } = useDate();
  const params = useParams();

  const [startTime, setStartTime] = useState<string>(
    format(toTimeZone(schedule.start), "HH:mm"),
  );
  const [endTime, setEndTime] = useState<string>(
    format(toTimeZone(schedule.end), "HH:mm"),
  );
  const [tag, setTag] = useState(schedule.tag || options[0].value);

  const { isUpdating, update } = useStaffScheduleUpdate({
    schedule: schedule._id,
    staff: params.id,
  });

  const { isUpdating: isUpdatingAll, updateGroup } =
    useStaffScheduleUpdateGroup({
      groupId: schedule.groupId,
      staff: params.id,
    });

  const { isDestroying, destroy } = useStaffScheduleDestroy({
    schedule: schedule._id,
    staff: params.id,
  });

  const { isDestroying: isDestroyingAll, destroyGroup } =
    useStaffScheduleDestroyGroup({
      groupId: schedule.groupId,
      staff: params.id,
    });

  const handleStart = useCallback((value: string) => setStartTime(value), []);
  const handleTag = useCallback((value: Tag) => setTag(value), []);
  const handleEnd = useCallback((value: string) => setEndTime(value), []);

  const updateDate = useCallback(
    async (type: "group" | null) => {
      const start = new Date(
        `${format(schedule.start, "yyyy-MM-dd")} ${startTime}`,
      );
      const end = new Date(`${format(schedule.end, "yyyy-MM-dd")} ${endTime}`);

      type == "group"
        ? updateGroup({
            end,
            start,
            tag,
          })
        : update({
            end,
            start,
          });

      close();
      show({
        content:
          type === "group"
            ? "Schedules has been updated"
            : "Schedule has been updated",
      });
    },
    [
      schedule.start,
      schedule.end,
      startTime,
      endTime,
      tag,
      updateGroup,
      update,
      close,
      show,
    ],
  );

  const deleteDate = useCallback(
    (type: "group" | null) => {
      type == "group" ? destroyGroup() : destroy();
      close();
      show({
        content:
          type === "group" ? "Schedules is deleted" : "Schedule is deleted",
      });
    },
    [destroyGroup, destroy, close, show],
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
  const updateDateAll = useCallback(() => updateDate("group"), [updateDate]);
  const deleteDateAll = useCallback(() => deleteDate("group"), [deleteDate]);

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

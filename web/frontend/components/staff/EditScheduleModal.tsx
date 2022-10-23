import { EventInput } from "@fullcalendar/react";
import {
  Button,
  Checkbox,
  Layout,
  Modal,
  Select,
  TextField,
} from "@shopify/polaris";
import { addDays, format } from "date-fns";
import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuthenticatedFetch } from "../../hooks";

interface Props {
  info: any;
  setInfo: any;
  refresh: any;
}

const options = [
  { label: "Green", value: "#4b6043" },
  { label: "Blue", value: "#235284" },
  { label: "Orange", value: "#d24e01" },
  { label: "Purple", value: "#4c00b0" },
];

export default ({ info, setInfo, refresh }: Props) => {
  const params = useParams();
  const toggleActive = () => setInfo(null);

  const extendedProps = info.event._def.extendedProps;
  const [startTime, setStartTime] = useState<string>(
    format(new Date(extendedProps.start), "HH:mm")
  );
  const [endTime, setEndTime] = useState<string>(
    format(new Date(extendedProps.end), "HH:mm")
  );
  const [tag, setTag] = useState(extendedProps.tag || options[0].value);
  const [available, setAvailable] = useState(extendedProps.available || false);

  const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

  const [loadingUpdateAll, setLoadingUpdateAll] = useState<boolean>(false);
  const [loadingDeleteAll, setLoadingDeleteAll] = useState<boolean>(false);

  const fetch = useAuthenticatedFetch();
  const updateSchedule = useCallback(
    async (body) => {
      return await fetch(
        `/api/admin/staff/${params.id}/schedules/${extendedProps._id}${
          body.groupId ? "/group/" + body.groupId : ""
        }`,
        {
          method: "PUT",
          body: JSON.stringify(body),
          headers: { "Content-Type": "application/json" },
        }
      ).then((res) => res.json());
    },
    [params, info, tag]
  );

  const deleteSchedule = useCallback(
    async (body) => {
      return await fetch(
        `/api/admin/staff/${params.id}/schedules/${extendedProps._id}${
          body.groupId ? "/group/" + body.groupId : ""
        }`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        }
      ).then((res) => res.json());
    },
    [params, info, tag]
  );

  const handleStart = (value) => setStartTime(value);
  const handleTag = (value) => setTag(value);
  const handleAvailable = (newChecked) => setAvailable(newChecked);
  const handleEnd = (value) => setEndTime(value);

  const updateDate = async (type: "all" | null) => {
    const start = new Date(`${extendedProps.start.substr(0, 10)} ${startTime}`);
    const end = new Date(`${extendedProps.end.substr(0, 10)} ${endTime}`);

    const body: Omit<Schedule, "_id" | "staff"> = {
      start: start.toISOString(),
      end: end.toISOString(),
      available: true,
      tag,
      ...(type === "all" ? { groupId: extendedProps.groupId } : null),
    };

    if (type == "all") {
      setLoadingUpdateAll(true);
    } else {
      setLoadingUpdate(true);
    }
    await updateSchedule(body);
    refresh();
    setInfo(null);
  };

  const deleteDate = async (type: "all" | null) => {
    const body = {
      ...(type === "all" ? { groupId: extendedProps.groupId } : null),
    };

    if (type == "all") {
      setLoadingDeleteAll(true);
    } else {
      setLoadingDelete(true);
    }
    await deleteSchedule(body);
    refresh();
    setInfo(null);
  };

  const formatDate = format(new Date(extendedProps.start), "MM/dd/yyyy");

  return (
    <Modal
      small
      open={true}
      onClose={toggleActive}
      title="Edit availability"
      secondaryActions={[
        {
          content: "Luk",
          onAction: toggleActive,
        },
      ]}
    >
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
              loading={loadingUpdate}
            >
              Redigere pågældende
            </Button>
          </Layout.Section>
          <Layout.Section>
            <Button
              destructive
              onClick={() => deleteDate(null)}
              loading={loadingDelete}
            >
              Slet pågældende
            </Button>
          </Layout.Section>
          {extendedProps.groupId && (
            <Layout.Section>
              <Button
                primary
                onClick={() => updateDate("all")}
                loading={loadingUpdateAll}
              >
                Redigere alle
              </Button>
            </Layout.Section>
          )}
          {extendedProps.groupId && (
            <Layout.Section>
              <Button
                destructive
                onClick={() => deleteDate("all")}
                loading={loadingDeleteAll}
              >
                Slet alle
              </Button>
            </Layout.Section>
          )}
        </Layout>
      </Modal.Section>
    </Modal>
  );
};

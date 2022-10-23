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

const options = [
  { label: "Green", value: "#4b6043" },
  { label: "Blue", value: "#235284" },
  { label: "Orange", value: "#d24e01" },
  { label: "Purple", value: "#4c00b0" },
];

export default ({ info, setInfo, refresh }) => {
  const params = useParams();
  const toggleActive = () => setInfo(null);

  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("16:00");
  const [tag, setTag] = useState(options[0].value);
  const [available, setAvailable] = useState(true);

  const [loadingCurrent, setLoadingCurrent] = useState<boolean>(false);
  const [loadingAll, setLoadingAll] = useState<boolean>(false);

  const fetch = useAuthenticatedFetch();
  const createSchedule = useCallback(
    async (body) => {
      return await fetch(`/api/admin/staff/${params.id}/schedules`, {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      }).then((res) => res.json());
    },
    [params, info, tag]
  );

  const handleStart = (value) => setStartTime(value);
  const handleTag = (value) => setTag(value);
  const handleAvailable = (newChecked) => setAvailable(newChecked);
  const handleEnd = (value) => setEndTime(value);

  const createCurrentDate = async () => {
    const start = new Date(`${info.dateStr} ${startTime}`);
    const end = new Date(`${info.dateStr} ${endTime}`);

    const body = {
      start: start.toISOString(),
      end: end.toISOString(),
      available: true,
      tag,
    };

    setLoadingCurrent(true);
    await createSchedule(body);
    refresh();
    setInfo(null);
  };

  const createAllDate = async () => {
    const start = new Date(`${info.dateStr} ${startTime}`);
    const end = new Date(`${info.dateStr} ${endTime}`);

    const body = Array(5)
      .fill(0)
      .map((i, index) => {
        return {
          start: addDays(start, 7 * index).toISOString(),
          end: addDays(end, 7 * index).toISOString(),
          available: true,
          tag,
        };
      });

    setLoadingAll(true);
    await createSchedule(body);
    refresh();
    setInfo(null);
  };

  const formatDate = info.dateStr;

  return (
    <Modal
      small
      open={true}
      onClose={toggleActive}
      title="Create new availability"
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
              onClick={createCurrentDate}
              loading={loadingCurrent}
            >
              Gælder for KUN for den pågældende dato
            </Button>
          </Layout.Section>
          <Layout.Section>
            <Button primary onClick={createAllDate} loading={loadingAll}>
              Gælder for alle {format(new Date(info.dateStr), "iiii")}
            </Button>
          </Layout.Section>
        </Layout>
      </Modal.Section>
    </Modal>
  );
};

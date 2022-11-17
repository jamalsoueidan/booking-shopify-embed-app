import {
  Button,
  Checkbox,
  Layout,
  Modal,
  Select,
  TextField,
} from '@shopify/polaris';
import {
  addDays,
  addHours,
  format,
  isAfter,
  isBefore,
  subHours,
} from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import useSetting from '../../services/setting';
import { useStaffScheduleCreate } from '../../services/staff/schedule';

const options = [
  { label: 'Green', value: '#4b6043' },
  { label: 'Blue', value: '#235284' },
  { label: 'Orange', value: '#d24e01' },
  { label: 'Purple', value: '#4c00b0' },
];

export default ({ info, setInfo, refresh }: any) => {
  const params = useParams();
  const toggleActive = () => setInfo(null);

  const [startTime, setStartTime] = useState<string>('09:00');
  const [endTime, setEndTime] = useState<string>('16:00');
  const [tag, setTag] = useState(options[0].value);
  const [available, setAvailable] = useState(true);

  const [loadingCurrent, setLoadingCurrent] = useState<boolean>(false);
  const [loadingAll, setLoadingAll] = useState<boolean>(false);

  const { create: createSchedule } = useStaffScheduleCreate({
    userId: params.id,
  });
  const { data: settings } = useSetting();

  const handleStart = (value: string) => setStartTime(value);
  const handleTag = (value: string) => setTag(value);
  const handleAvailable = (newChecked: boolean) => setAvailable(newChecked);
  const handleEnd = (value: string) => setEndTime(value);

  const createCurrentDate = async () => {
    const start = zonedTimeToUtc(
      `${info.dateStr} ${startTime}`,
      settings.timeZone
    );
    const end = zonedTimeToUtc(`${info.dateStr} ${endTime}`, settings.timeZone);

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
    let startDateTime = zonedTimeToUtc(
      `${info.dateStr} ${startTime}:00`,
      settings.timeZone
    );
    let endDateTime = zonedTimeToUtc(
      `${info.dateStr} ${endTime}:00`,
      settings.timeZone
    );

    const body = Array(5) //5 weeks create groupID
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
              onClick={createCurrentDate}
              loading={loadingCurrent}>
              Opret for pågældende dag
            </Button>
          </Layout.Section>
          <Layout.Section>
            <Button primary onClick={createAllDate} loading={loadingAll}>
              Opret for alle {format(new Date(info.dateStr), 'iiii')}
            </Button>
          </Layout.Section>
        </Layout>
      </Modal.Section>
    </Modal>
  );
};

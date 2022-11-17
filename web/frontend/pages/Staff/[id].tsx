import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import '@fullcalendar/react/dist/vdom';
import { useNavigate } from '@shopify/app-bridge-react';
import { Card, Page } from '@shopify/polaris';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useStaffScheduleList } from 'services/staff/schedule';
import CreateScheduleModal from '../../components/staff/CreateScheduleModal';
import EditScheduleModal from '../../components/staff/EditScheduleModal';
import Metadata from '../../components/staff/Metadata';
import useSetting from '../../services/setting';
import { useStaffGet } from '../../services/staff';

export default () => {
  const params = useParams();
  const navigate = useNavigate();

  const { data: staff } = useStaffGet({ userId: params.id });

  const { data: calendar } = useStaffScheduleList({ userId: params.id });

  const [createInfo, setCreateInfo] = useState(null);
  const [editInfo, setEditInfo] = useState(null);

  const createSchedule = useCallback((info: any) => {
    setCreateInfo(info);
  }, []);

  const editSchedule = useCallback((info: any) => {
    setEditInfo(info);
  }, []);

  const createScheduleModal = createInfo && (
    <CreateScheduleModal
      info={createInfo}
      setInfo={setCreateInfo}></CreateScheduleModal>
  );

  const editScheduleModal = editInfo && (
    <EditScheduleModal
      info={editInfo}
      setInfo={setEditInfo}></EditScheduleModal>
  );

  const { data: settings } = useSetting();

  const events = calendar?.payload?.map((c: any) => {
    const toTimeZone = (fromUTC: Date) =>
      utcToZonedTime(fromUTC, settings.timeZone);
    const start = toTimeZone(new Date(c.start));
    const end = toTimeZone(new Date(c.end));
    const startHour = format(start, 'HH:mm');
    const endHour = format(end, 'HH:mm');

    return {
      start,
      end,
      extendedProps: c,
      backgroundColor: c.tag,
      editable: true,
      display: 'block',
      title: `${startHour}-${endHour}`,
    };
  });

  if (!staff) {
    return <></>;
  }

  const { _id, fullname, active } = staff;

  return (
    <Page
      title={fullname}
      titleMetadata={<Metadata active={active} />}
      breadcrumbs={[{ content: 'Staff', url: '/Staff' }]}
      primaryAction={{
        content: 'Redigere ' + fullname,
        onAction: () => navigate('/Staff/Edit/' + _id),
      }}>
      {createScheduleModal}
      {editScheduleModal}
      <Card sectioned title="Time planning">
        <FullCalendar
          plugins={[interactionPlugin, dayGridPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth',
          }}
          events={events}
          firstDay={1}
          locale="da"
          dateClick={createSchedule}
          eventClick={editSchedule}
          selectable={true}
        />
      </Card>
    </Page>
  );
};

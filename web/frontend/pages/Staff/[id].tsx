import LoadingPage from '@components/LoadingPage';
import CreateScheduleModal from '@components/staff/CreateScheduleModal';
import EditScheduleModal from '@components/staff/EditScheduleModal';
import Metadata from '@components/staff/Metadata';
import StaffCalendar from '@components/staff/StaffCalendar';
import { DateClickArg } from '@fullcalendar/interaction';
import { EventClickArg } from '@fullcalendar/react';
import { useStaffGet } from '@services/staff';
import { useStaffScheduleList } from '@services/staff/schedule';
import { useNavigate } from '@shopify/app-bridge-react';
import { Card, Page } from '@shopify/polaris';
import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';

export default () => {
  const params = useParams();
  const navigate = useNavigate();

  const { data: staff } = useStaffGet({ userId: params.id });

  const { data: calendar } = useStaffScheduleList({ userId: params.id });

  const [showCreate, setShowCreate] = useState(null);
  const [showEdit, setShowEdit] = useState(null);

  const createSchedule = useCallback(
    (info: DateClickArg) => setShowCreate(info),
    []
  );

  const createScheduleModal = showCreate && (
    <CreateScheduleModal
      info={showCreate}
      setInfo={setShowCreate}></CreateScheduleModal>
  );

  const editSchedule = useCallback(
    (info: EventClickArg) => setShowEdit(info),
    []
  );

  const editScheduleModal = showEdit && (
    <EditScheduleModal
      info={showEdit}
      setInfo={setShowEdit}></EditScheduleModal>
  );

  if (!staff || !calendar) {
    return <LoadingPage />;
  }

  /*const events = calendar?.map((c: any) => {
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
  });*/

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
      <Card sectioned>
        <StaffCalendar
          events={calendar}
          create={createSchedule}
          edit={editSchedule}
        />
      </Card>
    </Page>
  );
};

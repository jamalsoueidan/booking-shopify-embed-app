import LoadingPage from '@components/LoadingPage';
import CreateScheduleModal from '@components/staff/CreateScheduleModal';
import EditScheduleModal from '@components/staff/EditScheduleModal';
import Metadata from '@components/staff/Metadata';
import StaffCalendar from '@components/staff/StaffCalendar';
import { DateClickArg } from '@fullcalendar/interaction';
import { EventClickArg } from '@fullcalendar/core';
import { useStaffGet, useStaffSchedule } from '@services';
import { useNavigate } from '@shopify/app-bridge-react';
import { Card, Page } from '@shopify/polaris';
import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';

export default () => {
  const params = useParams();
  const navigate = useNavigate();
  const [rangeDate, setRangeDate] = useState<CalendarDateChangeProps>();
  const { data: staff } = useStaffGet({ userId: params.id });

  const { data: calendar } = useStaffSchedule({
    staff: params.id,
    start: rangeDate?.start,
    end: rangeDate?.end,
  });

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

  const onChangeDate = useCallback(
    (props: CalendarDateChangeProps) => {
      if (props.start !== rangeDate?.start || props.end !== rangeDate?.end) {
        setRangeDate(props);
      }
    },
    [rangeDate]
  );

  if (!staff || !calendar) {
    return <LoadingPage />;
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
          onChangeDate={onChangeDate}
          events={calendar}
          create={createSchedule}
          edit={editSchedule}
        />
      </Card>
    </Page>
  );
};

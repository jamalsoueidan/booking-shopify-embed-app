import LoadingPage from '@components/LoadingPage';
import LoadingSpinner from '@components/LoadingSpinner';
import Metadata from '@components/staff/Metadata';
import { EventClickArg } from '@fullcalendar/core';
import { DateClickArg } from '@fullcalendar/interaction';
import { useStaffGet, useStaffSchedule } from '@services';
import { useNavigate } from '@shopify/app-bridge-react';
import { Card, Page } from '@shopify/polaris';
import { Suspense, lazy, useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';

const StaffCalendar = lazy(
  () => import('../../components/staff/StaffCalendar')
);

const CreateScheduleModal = lazy(
  () => import('../../components/staff/CreateScheduleModal')
);

const EditScheduleModal = lazy(
  () => import('../../components/staff/EditScheduleModal')
);

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

  const editSchedule = useCallback(
    (info: EventClickArg) => setShowEdit(info),
    []
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
    return (
      <LoadingPage
        title={!staff ? 'Loading staff data...' : 'Loading schedules data...'}
      />
    );
  }

  const { _id, fullname, active } = staff;

  return (
    <Page
      fullWidth
      title={fullname}
      titleMetadata={<Metadata active={active} />}
      breadcrumbs={[{ content: 'Staff', url: '/Staff' }]}
      primaryAction={{
        content: 'Redigere ' + fullname,
        onAction: () => navigate('/Staff/Edit/' + _id),
      }}>
      {showCreate && (
        <Suspense>
          <CreateScheduleModal info={showCreate} setInfo={setShowCreate} />
        </Suspense>
      )}
      {showEdit && (
        <Suspense>
          <EditScheduleModal info={showEdit} setInfo={setShowEdit} />
        </Suspense>
      )}
      <Card sectioned>
        <Suspense fallback={<LoadingSpinner />}>
          <StaffCalendar
            onChangeDate={onChangeDate}
            events={calendar}
            create={createSchedule}
            edit={editSchedule}
          />
        </Suspense>
      </Card>
    </Page>
  );
};

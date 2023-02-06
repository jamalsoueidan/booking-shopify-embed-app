import { MetaData } from "@components/staff/meta-data";
import { Schedule } from "@jamalsoueidan/bsb.types";
import {
  LoadingModal,
  LoadingPage,
  LoadingSpinner,
} from "@jamalsoueidan/bsf.bsf-pkg";
import { useStaffGet, useStaffSchedule } from "@services";
import { useNavigate } from "@shopify/app-bridge-react";
import { Card, Page } from "@shopify/polaris";
import { Suspense, lazy, useCallback, useState } from "react";
import { useParams } from "react-router-dom";

const ScheduleCalendar = lazy(() =>
  import("@jamalsoueidan/bsf.bsf-pkg").then((module) => ({
    default: module.ScheduleCalendar,
  })),
);

const CreateScheduleModal = lazy(() =>
  import("../../components/staff/modals/create-shift-modal").then((module) => ({
    default: module.CreateShiftModal,
  })),
);

const EditScheduleModal = lazy(() =>
  import("../../components/staff/modals//edit-shift-modal").then((module) => ({
    default: module.EditShiftModal,
  })),
);

export default () => {
  const params = useParams();
  const navigate = useNavigate();
  const [rangeDate, setRangeDate] = useState<CalendarDateChangeProps>();
  const [date, setDate] = useState<Date>();
  const [schedule, setSchedule] = useState<Schedule>();

  const close = useCallback(() => {
    setDate(null);
    setSchedule(null);
  }, []);

  const { data: staff } = useStaffGet({ userId: params.id });

  const { data: calendar } = useStaffSchedule({
    end: rangeDate?.end,
    staff: params.id,
    start: rangeDate?.start,
  });

  if (!staff || !calendar) {
    return (
      <LoadingPage
        title={!staff ? "Loading staff data..." : "Loading schedules data..."}
      />
    );
  }

  const { _id, fullname, active } = staff;

  return (
    <Page
      fullWidth
      title={fullname}
      titleMetadata={<MetaData active={active} />}
      breadcrumbs={[{ content: "Staff", onAction: () => navigate("/staff") }]}
      primaryAction={{
        content: "Redigere " + fullname,
        onAction: () => navigate("/staff/edit/" + _id),
      }}>
      <Card sectioned>
        {date && (
          <Suspense fallback={<LoadingModal />}>
            <CreateScheduleModal selectedDate={date} close={close} />
          </Suspense>
        )}
        {schedule && (
          <Suspense fallback={<LoadingModal />}>
            <EditScheduleModal schedule={schedule} close={close} />
          </Suspense>
        )}

        <Card sectioned>
          <Suspense fallback={<LoadingSpinner />}>
            <ScheduleCalendar
              onChangeDate={setRangeDate}
              data={calendar}
              onClick={setDate}
              onClickSchedule={setSchedule}
            />
          </Suspense>
        </Card>
      </Card>
    </Page>
  );
};

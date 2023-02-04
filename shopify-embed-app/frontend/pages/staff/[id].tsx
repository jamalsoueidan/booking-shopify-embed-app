import Metadata from "@components/staff/Metadata";
import { LoadingPage, LoadingSpinner } from "@jamalsoueidan/bsf.bsf-pkg";
import { useStaffGet, useStaffSchedule } from "@services";
import { useNavigate } from "@shopify/app-bridge-react";
import { Card, Page } from "@shopify/polaris";
import { Suspense, lazy, useState } from "react";
import { useParams } from "react-router-dom";

const ScheduleCalendar = lazy(() =>
  import("../../components/staff/ScheduleCalendar").then((module) => ({
    default: module.ScheduleCalendar,
  })),
);

export default () => {
  const params = useParams();
  const navigate = useNavigate();
  const [rangeDate, setRangeDate] = useState<CalendarDateChangeProps>();
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
      titleMetadata={<Metadata active={active} />}
      breadcrumbs={[{ content: "Staff", onAction: () => navigate("/staff") }]}
      primaryAction={{
        content: "Redigere " + fullname,
        onAction: () => navigate("/staff/edit/" + _id),
      }}>
      <Card sectioned>
        <Suspense fallback={<LoadingSpinner />}>
          <ScheduleCalendar events={calendar} onChangeDate={setRangeDate} />
        </Suspense>
      </Card>
    </Page>
  );
};

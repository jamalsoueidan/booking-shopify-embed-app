import { MetaData } from "@components/staff/meta-data";
import { Schedule } from "@jamalsoueidan/pkg.bsb-types";
import {
  LoadingModal,
  LoadingPage,
  LoadingSpinner,
  useTranslation,
} from "@jamalsoueidan/pkg.bsf";
import { useStaffGet, useStaffSchedule } from "@services";
import { useNavigate } from "@shopify/app-bridge-react";
import { Card, Page } from "@shopify/polaris";
import { Suspense, lazy, useCallback, useState } from "react";
import { useParams } from "react-router-dom";

const ScheduleCalendar = lazy(() =>
  import("@jamalsoueidan/pkg.bsf").then((module) => ({
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
  const { t } = useTranslation({ id: "staff-schedule", locales });
  const params = useParams();
  const navigate = useNavigate();
  const [rangeDate, setRangeDate] = useState<{ start: Date; end: Date }>();
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
      <LoadingPage title={!staff ? t("loading.staff") : t("loading.data")} />
    );
  }

  const { _id, fullname, active } = staff;

  return (
    <Page
      fullWidth
      title={t("title", { fullname })}
      titleMetadata={<MetaData active={active} />}
      breadcrumbs={[{ content: "staff", onAction: () => navigate("/staff") }]}
      primaryAction={{
        content: t("edit", { fullname }),
        onAction: () => navigate("/staff/edit/" + _id),
      }}
      secondaryActions={[
        {
          content: t("add"),
          onAction: () => setDate(new Date()),
        },
      ]}>
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

const locales = {
  da: {
    title: "{fullname} vagtplan",
    edit: "Redigere bruger",
    add: "Tilføj vagt",
    loading: {
      staff: "Henter medarbejder data",
      data: "Henter medarbejder vagtplan",
    },
  },
  en: {
    title: "{fullname} shifts",
    edit: "Edit staff",
    add: "Add shift",
    loading: {
      staff: "Loading staff data",
      data: "Loading staff shifts",
    },
  },
};

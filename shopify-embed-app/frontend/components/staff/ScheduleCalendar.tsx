import { EventClickArg } from "@fullcalendar/core";
import { DateClickArg } from "@fullcalendar/interaction";
import { Schedule as ScheduleEvent } from "@jamalsoueidan/bsb.mongodb.types";
import { LoadingModal, LoadingSpinner } from "@jamalsoueidan/bsf.bsf-pkg";
import { Card } from "@shopify/polaris";
import { Suspense, lazy, useCallback, useState } from "react";

const StaffCalendar = lazy(() => import("./StaffCalendar"));

const CreateScheduleModal = lazy(() =>
  import("./modals/create-shift-modal").then((module) => ({
    default: module.CreateShiftModal,
  })),
);
const EditScheduleModal = lazy(() =>
  import("./modals/edit-shift-modal").then((module) => ({
    default: module.EditShiftModal,
  })),
);

interface ScheduleProps {
  events: ScheduleEvent[];
  onChangeDate: (value: CalendarDateChangeProps) => void;
}

export const ScheduleCalendar = ({ events, onChangeDate }: ScheduleProps) => {
  const [showCreate, setShowCreate] = useState(null);
  const [showEdit, setShowEdit] = useState(null);

  const createSchedule = useCallback(
    (info: DateClickArg) => setShowCreate(info),
    [],
  );

  const editSchedule = useCallback(
    (info: EventClickArg) => setShowEdit(info),
    [],
  );

  return (
    <>
      {showCreate && (
        <Suspense fallback={<LoadingModal />}>
          <CreateScheduleModal info={showCreate} setInfo={setShowCreate} />
        </Suspense>
      )}
      {showEdit && (
        <Suspense fallback={<LoadingModal />}>
          <EditScheduleModal info={showEdit} setInfo={setShowEdit} />
        </Suspense>
      )}
      <Card sectioned>
        <Suspense fallback={<LoadingSpinner />}>
          <StaffCalendar
            onChangeDate={onChangeDate}
            data={events}
            create={createSchedule}
            edit={editSchedule}
          />
        </Suspense>
      </Card>
    </>
  );
};

import { Tag } from "@jamalsoueidan/pkg.bsb-types";
import {
  HelperDate,
  LoadingSpinner,
  ScheduleFormManyShiftsBody,
  ScheduleFormManyShiftsRefMethod,
  ScheduleFormManyShiftsSubmitResult,
  useStaffScheduleCreateGroup,
  useToast,
  useTranslation,
} from "@jamalsoueidan/pkg.bsf";
import { endOfMonth } from "date-fns";
import { Suspense, forwardRef, lazy, useCallback, useMemo } from "react";

interface CreateDayScheduleProps {
  date: Date;
  staff: string;
}

const CreateManyShifts = lazy(() =>
  import("@jamalsoueidan/pkg.bsf").then((module) => ({
    default: module.ScheduleFormManyShifts,
  })),
);

export const CreateManyShiftsModal = forwardRef<
  ScheduleFormManyShiftsRefMethod,
  CreateDayScheduleProps
>(({ date, staff }, ref) => {
  const { show } = useToast();
  const { createGroup } = useStaffScheduleCreateGroup({ staff });
  const { t } = useTranslation({ id: "create-many-shifts-modal", locales });

  const onSubmit = useCallback(
    (
      fieldValues: ScheduleFormManyShiftsBody,
    ): ScheduleFormManyShiftsSubmitResult => {
      createGroup(fieldValues);
      show({ content: t("success") });
      return { status: "success" };
    },
    [createGroup, show, t],
  );

  const initData = useMemo(
    () => ({
      days: [],
      end: HelperDate.resetDateTime(endOfMonth(date), 16),
      start: HelperDate.resetDateTime(date, 10),
      tag: Tag.all_day,
    }),
    [date],
  );

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CreateManyShifts
        data={initData}
        onSubmit={onSubmit}
        ref={ref}
        allowEditing={{ tag: true }}
      />
    </Suspense>
  );
});

const locales = {
  da: {
    success: "Vagtplaner oprettet",
  },
  en: {
    success: "Shifts created",
  },
};

import { Tag } from "@jamalsoueidan/pkg.backend-types";
import {
  HelperDate,
  LoadingSpinner,
  ScheduleFormOneShiftBody,
  ScheduleFormOneShiftRefMethod,
  ScheduleFormOneShiftSubmitResult,
  useStaffScheduleCreate,
  useToast,
  useTranslation,
} from "@jamalsoueidan/pkg.frontend";
import { Suspense, forwardRef, lazy, useCallback, useMemo } from "react";

interface CreateDayScheduleProps {
  date: Date;
  staff: string;
}

const CreateOneShift = lazy(() =>
  import("@jamalsoueidan/pkg.frontend").then((module) => ({
    default: module.ScheduleFormOneShift,
  })),
);

export const CreateOneShiftModal = forwardRef<
  ScheduleFormOneShiftRefMethod,
  CreateDayScheduleProps
>(({ date, staff }, ref) => {
  const { show } = useToast();
  const { t } = useTranslation({ id: "create-one-shifts-modal", locales });
  const { create } = useStaffScheduleCreate({ staff });

  const onSubmit = useCallback(
    (
      fieldValues: ScheduleFormOneShiftBody,
    ): ScheduleFormOneShiftSubmitResult => {
      create(fieldValues);
      show({ content: t("success") });
      return { status: "success" };
    },
    [create, show, t],
  );

  const initData = useMemo(
    () => ({
      end: HelperDate.resetDateTime(date, 16),
      start: HelperDate.resetDateTime(date, 10),
      tag: Tag.all_day,
    }),
    [date],
  );

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CreateOneShift
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
    success: "Vagtplan oprettet",
  },
  en: {
    success: "Shift created",
  },
};

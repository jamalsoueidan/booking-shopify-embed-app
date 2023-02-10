import {
  CreateManyShiftsBody,
  CreateManyShiftsRefMethod,
  CreateManyShiftsSubmitResult,
  LoadingSpinner,
  useToast,
  useTranslation,
} from "@jamalsoueidan/pkg.bsf";
import { useStaffScheduleCreateGroup } from "@services/staff/schedule";
import { Suspense, forwardRef, lazy, useCallback } from "react";
import { useParams } from "react-router-dom";

interface CreateDayScheduleProps {
  selectedDate: Date;
}

const CreateManyShifts = lazy(() =>
  import("@jamalsoueidan/pkg.bsf").then((module) => ({
    default: module.CreateManyShifts,
  })),
);

export const CreateManyShiftsModal = forwardRef<
  CreateManyShiftsRefMethod,
  CreateDayScheduleProps
>(({ selectedDate }, ref) => {
  const { show } = useToast();
  const params = useParams();
  const { createGroup } = useStaffScheduleCreateGroup({
    staff: params.id,
  });
  const { t } = useTranslation({ id: "create-many-shifts-modal", locales });

  const onSubmit = useCallback(
    (fieldValues: CreateManyShiftsBody): CreateManyShiftsSubmitResult => {
      createGroup(fieldValues);
      show({ content: t("success") });
      return { status: "success" };
    },
    [createGroup, show, t],
  );

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CreateManyShifts
        selectedDate={selectedDate}
        onSubmit={onSubmit}
        ref={ref}
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

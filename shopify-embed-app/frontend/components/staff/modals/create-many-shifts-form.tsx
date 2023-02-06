import {
  CreateManyShiftsBody,
  CreateManyShiftsRefMethod,
  CreateManyShiftsSubmitResult,
  LoadingSpinner,
  useToast,
  useTranslation,
} from "@jamalsoueidan/bsf.bsf-pkg";
import { useStaffScheduleCreate } from "@services/staff/schedule";
import { Suspense, forwardRef, lazy, useCallback } from "react";
import { useParams } from "react-router-dom";

interface CreateDayScheduleProps {
  selectedDate: Date;
}

const CreateManyShifts = lazy(() =>
  import("@jamalsoueidan/bsf.bsf-pkg").then((module) => ({
    default: module.CreateManyShifts,
  })),
);

export const CreateManyShiftsModal = forwardRef<
  CreateManyShiftsRefMethod,
  CreateDayScheduleProps
>(({ selectedDate }, ref) => {
  const { show } = useToast();
  const params = useParams();
  const { create } = useStaffScheduleCreate({
    staff: params.id,
  });
  const { t } = useTranslation({ id: "create-many-shifts-modal", locales });

  const onSubmit = useCallback(
    (fieldValues: CreateManyShiftsBody): CreateManyShiftsSubmitResult => {
      create(fieldValues);
      show({ content: t("success") });
      return { status: "success" };
    },
    [create, show, t],
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

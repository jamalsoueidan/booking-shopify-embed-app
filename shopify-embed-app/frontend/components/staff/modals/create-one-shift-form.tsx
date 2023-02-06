import {
  CreateOneShiftBody,
  CreateOneShiftRefMethod,
  CreateOneShiftSubmitResult,
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

const CreateOneShift = lazy(() =>
  import("@jamalsoueidan/bsf.bsf-pkg").then((module) => ({
    default: module.CreateOneShift,
  })),
);

export const CreateOneShiftModal = forwardRef<
  CreateOneShiftRefMethod,
  CreateDayScheduleProps
>(({ selectedDate }, ref) => {
  const { show } = useToast();
  const { t } = useTranslation({ id: "create-many-shifts-modal", locales });
  const params = useParams();
  const { create } = useStaffScheduleCreate({
    staff: params.id,
  });

  const onSubmit = useCallback(
    (fieldValues: CreateOneShiftBody): CreateOneShiftSubmitResult => {
      create(fieldValues);
      show({ content: t("success") });
      return { status: "success" };
    },
    [create, show, t],
  );

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CreateOneShift
        selectedDate={selectedDate}
        onSubmit={onSubmit}
        ref={ref}
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

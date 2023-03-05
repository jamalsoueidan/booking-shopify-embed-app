import { Schedule } from "@jamalsoueidan/pkg.backend-types";
import {
  LoadingSpinner,
  ScheduleFormManyShiftsBody,
  ScheduleFormManyShiftsRefMethod,
  ScheduleFormManyShiftsSubmitResult,
  useStaffScheduleDestroy,
  useStaffScheduleDestroyGroup,
  useStaffScheduleGetGroup,
  useStaffScheduleUpdateGroup,
  useToast,
  useTranslation,
} from "@jamalsoueidan/pkg.frontend";
import { Modal } from "@shopify/polaris";
import { Suspense, lazy, useCallback, useRef } from "react";

const EditManyShifts = lazy(() =>
  import("@jamalsoueidan/pkg.frontend").then((module) => ({
    default: module.ScheduleFormManyShifts,
  })),
);

interface EditManyScheduleProps {
  schedule: Schedule;
  close: () => void;
}

export const EditManyShiftsModal = ({
  schedule,
  close,
}: EditManyScheduleProps) => {
  const ref = useRef<ScheduleFormManyShiftsRefMethod>();
  const { show } = useToast();
  const { t } = useTranslation({ id: "edit-many-shifts-modal", locales });

  const { data: group } = useStaffScheduleGetGroup({
    groupId: schedule.groupId,
    staff: schedule.staff,
  });

  const { updateGroup } = useStaffScheduleUpdateGroup({
    groupId: schedule.groupId,
    staff: schedule.staff,
  });

  const { destroyGroup } = useStaffScheduleDestroyGroup({
    groupId: schedule.groupId,
    staff: schedule.staff,
  });

  const { destroy } = useStaffScheduleDestroy({
    schedule: schedule._id,
    staff: schedule.staff,
  });

  const onDestroy = useCallback(() => {
    destroyGroup();
    close();
  }, [close, destroyGroup]);

  const onDestroyOne = useCallback(() => {
    destroy();
    close();
  }, [close, destroy]);

  const onSubmit = useCallback(
    (
      fieldValues: ScheduleFormManyShiftsBody,
    ): ScheduleFormManyShiftsSubmitResult => {
      updateGroup(fieldValues);
      show({ content: t("success") });
      return { status: "success" };
    },
    [updateGroup, show, t],
  );

  const submit = useCallback(() => {
    const noErrors = ref.current.submit().length === 0;
    if (noErrors) {
      close();
    }
  }, [close]);

  console.log(group);

  return (
    <Modal
      open={true}
      onClose={close}
      title={t("title")}
      primaryAction={{
        content: t("save_changes"),
        onAction: submit,
      }}
      secondaryActions={[
        {
          content: t("destroy_one"),
          destructive: true,
          onAction: onDestroyOne,
        },
        {
          content: t("destroy"),
          destructive: true,
          onAction: onDestroy,
        },
      ]}>
      <Modal.Section>
        <Suspense fallback={<LoadingSpinner />}>
          {group && (
            <EditManyShifts data={group} onSubmit={onSubmit} ref={ref} />
          )}
        </Suspense>
      </Modal.Section>
    </Modal>
  );
};

const locales = {
  da: {
    destroy: "Slet alle",
    destroy_one: "Slet pågældende",
    save_changes: "Gem ændringer",
    success: "Vagtplaner redigeret",
    title: "Redigere vagtplaner",
  },
  en: {
    destroy: "Delete all",
    destroy_one: "Delete one",
    save_changes: "Save changes",
    success: "Shifts edited",
    title: "Edit shifts",
  },
};

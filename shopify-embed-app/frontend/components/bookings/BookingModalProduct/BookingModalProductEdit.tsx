import { FormErrors } from "@components/FormErrors";
import { useExtendForm, useTranslation } from "@hooks";
import { LoadingSpinner } from "@jamalsoueidan/bsf.bsf-pkg";
import { useModal } from "@providers/modal";
import { useToast } from "@providers/toast";
import { useBookingUpdate, useWidgetStaff } from "@services";
import { Form, FormLayout, Modal, Text } from "@shopify/polaris";
import { notEmpty, useField } from "@shopify/react-form";
import { useEffect } from "react";
import {
  ScheduleDateSelect,
  ScheduleStaffSelect,
  ScheduleTimerSelect,
} from "../BookingForm";

export default ({ info, toggle }: BookingModalProductChildProps) => {
  const { data: staffOptions } = useWidgetStaff({
    productId: info.productId,
  });

  const { update } = useBookingUpdate({ id: info._id });
  const { t } = useTranslation("bookings.modal.product.edit");
  const { show } = useToast();
  const { setPrimaryAction, setSecondaryActions } = useModal();

  useEffect(() => {
    setPrimaryAction({
      content: "Ændre dato/tid",
      onAction: submit,
    });
    setSecondaryActions([
      {
        content: "Annullere",
        onAction: toggle,
      },
    ]);

    return () => {
      setSecondaryActions(null);
      setPrimaryAction(null);
    };
  }, [setPrimaryAction, setPrimaryAction]);

  const { fields, submit, submitErrors, isSubmitted, isValid } = useExtendForm({
    fields: {
      staff: useField<string>({
        value: info.staff._id || "",
        validates: [notEmpty("staff is required")],
      }),
      date: useField<Date>({
        value: new Date(info.start) || undefined,
        validates: [notEmpty("date is required")],
      }),
      time: useField<{ start: string; end: string }>({
        value: {
          start: info.start || undefined,
          end: info.end || undefined,
        },
        validates: [notEmpty("time is required")],
      }),
    },
    onSubmit: async (fieldValues: any) => {
      update({
        start: fieldValues.time.start,
        end: fieldValues.time.end,
        staff: fieldValues.staff,
      });
      toggle();
      show({ content: t("toast") });
      return { status: "success" };
    },
    enableSaveBar: false,
  });

  if (!staffOptions) {
    return (
      <Modal.Section>
        <LoadingSpinner />
      </Modal.Section>
    );
  }

  if (staffOptions.length === 0) {
    return (
      <Modal.Section>
        <Text variant="bodyMd" as="p">
          Der er ingen medarbejder længere tilknyttet til dette produkt, gå til
          produkt og tilføj medarbejder.
        </Text>
      </Modal.Section>
    );
  }

  return (
    <Form onSubmit={submit}>
      <Modal.Section>
        <FormLayout>
          {isSubmitted && !isValid && <FormErrors errors={submitErrors} />}
          <ScheduleStaffSelect
            field={fields.staff}
            productId={info.productId}
          />
          <ScheduleDateSelect
            field={fields.date}
            productId={info.productId}
            staff={fields.staff.value}
          />
          <ScheduleTimerSelect
            field={fields.time}
            productId={info.productId}
            staff={fields.staff.value}
            date={fields.date.value}
          />
          <Text variant="bodyMd" as="p" color="critical">
            ATTENTION: When you update this booking it will get deattached from
            shopify order.
          </Text>
        </FormLayout>
      </Modal.Section>
    </Form>
  );
};

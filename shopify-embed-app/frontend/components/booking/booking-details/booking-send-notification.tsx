import { Booking } from "@jamalsoueidan/pkg.bsb-types";
import {
  FormErrors,
  useForm,
  useModal,
  useToast,
} from "@jamalsoueidan/pkg.bsf";
import { useSendCustomNotification } from "@services";
import { Form, Modal, Select, Stack, TextField } from "@shopify/polaris";
import { lengthMoreThan, notEmpty, useField } from "@shopify/react-form";
import { useEffect, useMemo } from "react";

export const BookingSendNotification = ({ booking }: { booking: Booking }) => {
  const { send } = useSendCustomNotification({
    lineItemId: booking.lineItemId,
    orderId: booking.orderId,
  });

  const { setPrimaryAction } = useModal();

  const { show } = useToast();

  const { submitting, fields, submit, submitErrors, isSubmitted, isValid } =
    useForm({
      enableSaveBar: false,
      fields: {
        message: useField({
          validates: [
            notEmpty("message is required"),
            lengthMoreThan(20, "message must be more than 20 characters"),
          ],
          value: "",
        }),
        to: useField({
          validates: [notEmpty("to is required")],
          value: "",
        }),
      },
      onSubmit: async (fieldValues) => {
        const response = await send(fieldValues);
        if (!response.success) {
          show({ content: "Error happened", error: true });
          return {
            errors: [{ fields: "ijooji", message: response.error }],
            status: "fail",
          };
        }
        show({ content: "Message sent" });
        return { status: "success" };
      },
    });

  useEffect(() => {
    setPrimaryAction({
      content: "Send Message",
      disabled: submitting,
      loading: submitting,
      onAction: submit,
    });

    return () => {
      setPrimaryAction(null);
    };
  }, [setPrimaryAction, submitting, submit]);

  const options = useMemo(
    () => [
      { label: "Choose receiver", value: "" },
      {
        label: "Customer",
        value: "customer",
      },
      { label: "Staff", value: "staff" },
    ],
    [],
  );

  return (
    <Form onSubmit={submit}>
      <Modal.Section>
        <Stack vertical>
          {isSubmitted && !isValid && <FormErrors errors={submitErrors} />}
          <Select label="To" options={options} {...fields.to} />
          <TextField
            label="Meddelse"
            multiline={4}
            autoComplete="off"
            {...fields.message}
          />
        </Stack>
      </Modal.Section>
    </Form>
  );
};

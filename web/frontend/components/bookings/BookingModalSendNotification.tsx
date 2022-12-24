import { FormErrors } from '@components/FormErrors';
import FormToast from '@components/FormToast';
import { useCustomForm } from '@hooks';
import { useModal } from '@providers/modal';
import { useSendCustomNotification } from '@services';
import { Form, Modal, Select, Stack, TextField } from '@shopify/polaris';
import { lengthMoreThan, notEmpty, useField } from '@shopify/react-form';
import { useEffect, useMemo } from 'react';

export default ({ info }: BookingModalProps) => {
  const { send } = useSendCustomNotification({
    orderId: info.orderId,
    lineItemId: info.lineItemId,
  });

  const { setPrimaryAction } = useModal();

  const {
    submitting,
    fields,
    submit,
    submitErrors,
    isSubmitted,
    isValid,
    reset,
  } = useCustomForm(
    {
      fields: {
        message: useField({
          value: '',
          validates: [
            notEmpty('message is required'),
            lengthMoreThan(20, 'message must be more than 20 characters'),
          ],
        }),
        to: useField({
          value: '',
          validates: [notEmpty('to is required')],
        }),
      },
      onSubmit: async (fieldValues) => {
        const response = await send(fieldValues);
        reset();
        if (!response.success) {
          return {
            status: 'fail',
            errors: [{ fields: 'ijooji', message: response.error }],
          };
        }
        return { status: 'success' };
      },
    },
    false
  );

  useEffect(() => {
    setPrimaryAction({
      content: 'Send Message',
      onAction: submit,
      disabled: submitting,
      loading: submitting,
    });

    return () => {
      setPrimaryAction(null);
    };
  }, [setPrimaryAction, submitting, submit]);

  const options = useMemo(
    () => [
      { label: 'Choose receiver', value: '' },
      {
        label: 'Customer',
        value: 'customer',
      },
      { label: 'Staff', value: 'staff' },
    ],
    []
  );

  return (
    <Form onSubmit={submit}>
      {isSubmitted && (
        <FormToast
          message={isValid ? 'Message send' : 'Error happened'}
          error={!isValid}
        />
      )}
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

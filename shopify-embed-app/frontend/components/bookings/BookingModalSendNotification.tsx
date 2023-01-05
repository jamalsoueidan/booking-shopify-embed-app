import { FormErrors } from '@components/FormErrors';
import { useExtendForm } from '@hooks';
import { useModal } from '@providers/modal';
import { useToast } from '@providers/toast';
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

  const { show } = useToast();

  const { submitting, fields, submit, submitErrors, isSubmitted, isValid } =
    useExtendForm({
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
        if (!response.success) {
          show({ content: 'Error happened', error: true });
          return {
            status: 'fail',
            errors: [{ fields: 'ijooji', message: response.error }],
          };
        }
        show({ content: 'Message sent' });
        return { status: 'success' };
      },
      enableSaveBar: false,
    });

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

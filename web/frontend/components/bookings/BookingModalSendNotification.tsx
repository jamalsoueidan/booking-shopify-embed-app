import isEmail from '@libs/validators/isEmail';
import isPhoneNumber from '@libs/validators/isPhoneNumber';
import { Button, Form, Modal, Stack, TextField } from '@shopify/polaris';
import {
  lengthMoreThan,
  notEmpty,
  useField,
  useForm,
} from '@shopify/react-form';

export default ({ info }: BookingModalChildProps) => {
  //https://codesandbox.io/s/1wpxz?file=/src/MyForm.tsx:2457-2473
  const { fields, submit } = useForm({
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
        validates: [notEmpty('Email is required'), isEmail('Invalid email')],
      }),
    },
    onSubmit: async (fieldValues) => {
      return { status: 'success' };
    },
  });

  return (
    <Form onSubmit={() => null}>
      <Modal.Section>
        <TextField
          label="Meddelse"
          multiline={4}
          autoComplete="off"
          {...fields.message}
        />
      </Modal.Section>
      <Modal.Section>
        <Button onClick={submit}>Send message</Button>
      </Modal.Section>
    </Form>
  );
};

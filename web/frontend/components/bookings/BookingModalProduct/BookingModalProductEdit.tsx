import { FormErrors } from '@components/FormErrors';
import LoadingSpinner from '@components/LoadingSpinner';
import { useCustomForm } from '@hooks';
import { useBookingUpdate, useWidgetStaff } from '@services';
import { Form, FormLayout, Modal, Text } from '@shopify/polaris';
import { notEmpty, useField } from '@shopify/react-form';
import { forwardRef, useImperativeHandle } from 'react';
import {
  ScheduleDateSelect,
  ScheduleStaffSelect,
  ScheduleTimerSelect,
} from '../BookingForm';

export default forwardRef(({ info }: BookingModalChildProps, ref) => {
  const { data: staffOptions } = useWidgetStaff({
    productId: info.productId,
  });

  const { update } = useBookingUpdate({ id: info._id });

  const { validate, fields, submit, submitErrors, isSubmitted, isValid } =
    useCustomForm({
      fields: {
        staff: useField({
          value: info.staff._id || '',
          validates: [notEmpty('staff is required')],
        }),
        date: useField({
          value: info.start || undefined,
          validates: [notEmpty('date is required')],
        }),
        time: useField({
          value: { start: info.start || undefined, end: info.end || undefined },
          validates: [notEmpty('time is required')],
        }),
      },
      onSubmit: async (fieldValues: any) => {
        update({
          start: fieldValues.time.start,
          end: fieldValues.time.end,
          staff: fieldValues.staff,
        });

        return { status: 'success' };
      },
    });

  useImperativeHandle(
    ref,
    () => ({
      submit() {
        submit();
        return validate().length == 0;
      },
    }),
    []
  );

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
});

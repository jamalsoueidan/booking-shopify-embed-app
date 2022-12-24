import FormToast from '@components/FormToast';
import LoadingSpinner from '@components/LoadingSpinner';
import { useBookingGet } from '@services';
import { Modal } from '@shopify/polaris';
import { useCallback, useState } from 'react';
import BookingModalProductEdit from './BookingModalProduct/BookingModalProductEdit';
import BookingModalProductView from './BookingModalProduct/BookingModalProductView';

export default ({ info }: BookingModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { data: booking } = useBookingGet({ id: info._id });

  const toggle = useCallback(() => setIsEditing((value) => !value), []);

  if (!booking) {
    return (
      <Modal.Section>
        <LoadingSpinner />
      </Modal.Section>
    );
  }

  return (
    <>
      {isSubmitted && <FormToast message={'Booking updated'} />}

      {isEditing ? (
        <BookingModalProductEdit info={booking} toggle={toggle} />
      ) : (
        <BookingModalProductView info={booking} toggle={toggle} />
      )}
    </>
  );
};

import FormToast from '@components/FormToast';
import LoadingSpinner from '@components/LoadingSpinner';
import { useBookingGet } from '@services/bookings';
import { useWidgetStaff } from '@services/widget';
import { Modal } from '@shopify/polaris';
import { useCallback, useEffect, useRef, useState } from 'react';
import BookingModalProductEdit from './BookingModalProduct/BookingModalProductEdit';
import BookingModalProductView from './BookingModalProduct/BookingModalProductView';

interface RefMethod {
  submit: () => boolean;
}

export default ({
  info,
  setPrimaryAction,
  setSecondaryActions,
}: BookingModalChildProps) => {
  const ref = useRef<RefMethod>();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { data: booking } = useBookingGet({ id: info._id });

  const toggle = useCallback(() => setIsEditing((value) => !value), []);
  const submit = useCallback(() => {
    ref.current.submit();
    setIsSubmitted((value) => true);
    toggle();
  }, [ref, toggle]);

  useEffect(() => {
    setSecondaryActions([]);
    setPrimaryAction(null);

    if (isEditing) {
      setPrimaryAction({
        content: 'Ændre dato/tid',
        onAction: submit,
      });
      setSecondaryActions([
        {
          content: 'Annullere',
          onAction: toggle,
        },
      ]);
    } else {
      setSecondaryActions([
        {
          content: 'Ændre dato/tid',
          onAction: toggle,
        },
      ]);
    }
  }, [isEditing, setPrimaryAction]);

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
        <BookingModalProductEdit
          info={booking}
          setPrimaryAction={setPrimaryAction}
          setSecondaryActions={setSecondaryActions}
          ref={ref}
        />
      ) : (
        <BookingModalProductView
          info={booking}
          setPrimaryAction={setPrimaryAction}
          setSecondaryActions={setSecondaryActions}
        />
      )}
    </>
  );
};

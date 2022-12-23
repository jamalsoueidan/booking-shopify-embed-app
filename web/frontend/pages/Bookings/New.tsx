import { NewBookingForm } from '@components/bookings/NewBookingForm';
import { useStaffCreate } from '@services';
import { useNavigate } from '@shopify/app-bridge-react';
import { useCallback } from 'react';

export default () => {
  const navigate = useNavigate();
  const { create } = useStaffCreate();

  const submit = useCallback(
    async (fieldValues: any) => {
      const staff = await create(fieldValues);
      navigate(`/Staff/${staff._id}`);
    },
    [create, navigate]
  );

  return (
    <NewBookingForm
      action={submit}
      breadcrumbs={[
        { content: 'Bookings', url: '/Bookings' },
      ]}></NewBookingForm>
  );
};

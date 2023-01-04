import { StaffForm } from '@components/staff/_form';
import { useStaffCreate } from '@services';
import { useNavigate } from '@shopify/app-bridge-react';
import { useCallback } from 'react';

export default () => {
  const navigate = useNavigate();
  const { create } = useStaffCreate();

  const submit = useCallback(
    async (fieldValues: any) => {
      const staff = await create(fieldValues);
      navigate(`/Staff/${staff.payload._id}`);
    },
    [create, navigate]
  );

  return (
    <StaffForm
      action={submit}
      breadcrumbs={[{ content: 'Staff', url: '/Staff' }]}></StaffForm>
  );
};

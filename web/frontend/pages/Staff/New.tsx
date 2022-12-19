import { StaffForm } from '@components/staff/_form';
import { useStaffCreate } from '@services';
import { useNavigate } from '@shopify/app-bridge-react';

export default () => {
  const navigate = useNavigate();
  const { create } = useStaffCreate();

  const submit = async (fieldValues: any) => {
    const staff = await create(fieldValues);
    navigate(`/Staff/${staff._id}`);
  };

  return (
    <StaffForm
      action={submit}
      breadcrumbs={[{ content: 'Staff', url: '/Staff' }]}></StaffForm>
  );
};

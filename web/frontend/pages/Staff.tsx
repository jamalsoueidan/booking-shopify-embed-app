import LoadingPage from '@components/LoadingPage';
import StaffList from '@components/staff/Staff-List';
import { useStaffList } from '@services/staff';
import { useNavigate } from '@shopify/app-bridge-react';

export default () => {
  const { data } = useStaffList();

  const navigate = useNavigate();

  if (!data) {
    return <LoadingPage />;
  }

  if (data?.length === 0) {
    navigate('/Staff/Empty');
    return <></>;
  }

  return <StaffList></StaffList>;
};

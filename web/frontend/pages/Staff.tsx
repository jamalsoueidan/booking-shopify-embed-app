import LoadingPage from '@components/LoadingPage';
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
  } else {
    navigate('/Staff/List');
  }

  return <></>;
};

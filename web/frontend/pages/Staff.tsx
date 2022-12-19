import LoadingPage from '@components/LoadingPage';
import { useStaff } from '@services';
import { useNavigate } from '@shopify/app-bridge-react';

export default () => {
  const { data } = useStaff();

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

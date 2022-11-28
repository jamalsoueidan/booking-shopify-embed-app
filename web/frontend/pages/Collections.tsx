import LoadingPage from '@components/LoadingPage';
import { useCollectionList } from '@services/collection';
import { useNavigate } from '@shopify/app-bridge-react';

export default () => {
  const navigate = useNavigate();
  const { data } = useCollectionList();

  if (!data) {
    return <LoadingPage />;
  }

  if (data?.length === 0) {
    navigate('/Collections/Empty');
  } else {
    navigate('/Collections/List');
  }
  return <></>;
};

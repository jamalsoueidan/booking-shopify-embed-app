import { useNavigate } from '@shopify/app-bridge-react';
import { Layout, Page, Spinner } from '@shopify/polaris';
import { useState } from 'react';
import { useCollectionList } from '@services/collection';
import AddNewCollection from '@components/collections/AddNewCollection';
import CollectionsList from '@components/collections/Collections-List';
import { useTranslation } from 'react-i18next';
import LoadingPage from '@components/LoadingPage';

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

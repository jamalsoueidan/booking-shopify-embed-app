import { useNavigate } from '@shopify/app-bridge-react';
import { Layout, Page, Spinner } from '@shopify/polaris';
import { useState } from 'react';
import { useCollectionList } from '@services/collection';
import AddNewCollection from '@components/collections/AddNewCollection';
import CollectionsList from '@components/collections/Collections-List';
import { useTranslation } from 'react-i18next';
import LoadingPage from '@components/LoadingPage';

export default () => {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const { data } = useCollectionList();
  const { t } = useTranslation('collections');

  if (!data) {
    return <LoadingPage />;
  }

  if (data?.length === 0) {
    navigate('/Collections/Empty');
    return <></>;
  }

  const collection = data.map((collection: Collection) => (
    <CollectionsList
      key={collection._id}
      collection={collection}></CollectionsList>
  ));

  return (
    <Page
      title={t('title')}
      primaryAction={{
        content: t('add_collection'),
        onAction: () => setOpen(true),
      }}>
      <AddNewCollection open={open} setOpen={setOpen}></AddNewCollection>
      {collection}
    </Page>
  );
};

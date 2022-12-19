import AddNewCollection from '@components/collections/AddNewCollection';
import CollectionsList from '@components/collections/CollectionsList';
import LoadingPage from '@components/LoadingPage';
import { useCollection } from '@services';
import { Page } from '@shopify/polaris';
import { useState } from 'react';
import { useTranslation } from '@hooks';

export default () => {
  const [open, setOpen] = useState(false);

  const { data } = useCollection();
  const { t } = useTranslation('collections');

  if (!data) {
    return <LoadingPage />;
  }

  const collection = data.map((collection) => (
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

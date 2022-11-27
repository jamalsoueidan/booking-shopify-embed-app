import AddNewCollection from '@components/collections/AddNewCollection';
import CollectionsList from '@components/collections/Collections-List';
import { useCollectionList } from '@services/collection';
import { Page } from '@shopify/polaris';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default () => {
  const [open, setOpen] = useState(false);

  const { data } = useCollectionList();
  const { t } = useTranslation('collections');

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

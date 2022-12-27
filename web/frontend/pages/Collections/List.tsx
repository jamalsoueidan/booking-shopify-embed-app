import LoadingPage from '@components/LoadingPage';
import AddNewCollection from '@components/collections/AddNewCollection';
import CollectionsList from '@components/collections/CollectionsList';
import { useTranslation } from '@hooks';
import { sortStrings } from '@libs/sortStrings';
import { useCollection } from '@services';
import { Page } from '@shopify/polaris';
import { useMemo, useState } from 'react';

export default () => {
  const [open, setOpen] = useState(false);

  const { data } = useCollection();
  const { t } = useTranslation('collections');

  const collection = useMemo(() => {
    if (!data) {
      return [];
    }

    return [...data]
      .sort(sortStrings('title'))
      .map((collection) => (
        <CollectionsList
          key={collection._id}
          collection={collection}></CollectionsList>
      ));
  }, [data]);

  if (!data) {
    return <LoadingPage />;
  }

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

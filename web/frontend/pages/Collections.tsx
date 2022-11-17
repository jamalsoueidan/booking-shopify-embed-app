import { useNavigate } from '@shopify/app-bridge-react';
import { Layout, Page, Spinner } from '@shopify/polaris';
import { useState } from 'react';
import { useCollectionList } from '@services/collection';
import AddNewCollection from '@components/collections/AddNewCollection';
import CollectionsList from '@components/collections/Collections-List';

export default () => {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const { data } = useCollectionList();

  if (!data) {
    return (
      <Page>
        <Layout>
          <Spinner accessibilityLabel="Spinner example" size="large" />
        </Layout>
      </Page>
    );
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
      narrowWidth
      title="Collections"
      primaryAction={{
        content: 'Add collection',
        onAction: () => setOpen(true),
      }}>
      <AddNewCollection open={open} setOpen={setOpen}></AddNewCollection>
      {collection}
    </Page>
  );
};

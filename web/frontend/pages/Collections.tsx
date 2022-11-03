import { useNavigate } from '@shopify/app-bridge-react';
import { Layout, Page, Spinner } from '@shopify/polaris';
import { useState } from 'react';
import useSWR from 'swr';
import AddNewCollection from '../components/collections/AddNewCollection';
import CollectionsList from '../components/collections/Collections-List';
import { useAuthenticatedFetch } from '../hooks';

export default () => {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const fetch = useAuthenticatedFetch();
  const { data } = useSWR<CollectionsApi>(
    '/api/admin/collections',
    (apiURL: string) => fetch(apiURL).then((res: Response) => res.json())
  );

  if (!data) {
    return (
      <Page>
        <Layout>
          <Spinner accessibilityLabel="Spinner example" size="large" />
        </Layout>
      </Page>
    );
  }

  if (data?.payload.length === 0) {
    navigate('/Collections/Empty');
    return <></>;
  }

  const collection = data.payload.map((collection) => (
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

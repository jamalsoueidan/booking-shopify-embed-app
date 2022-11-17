import { useCollectionCreate, useCollectionList } from '@services/collection';
import { ResourcePicker, useNavigate } from '@shopify/app-bridge-react';
import { EmptyState, Layout, Page } from '@shopify/polaris';
import { useState } from 'react';
import { notFoundImage } from '../../assets';

export default () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { create } = useCollectionCreate();

  const handleSelection = async (resources: Resources) => {
    const ids = resources.selection.map((s) => s.id);
    await create(ids);
    setOpen(false);
  };

  const { data } = useCollectionList();

  if (data?.length > 0) {
    navigate('/Collections');
    return <></>;
  }

  return (
    <Page narrowWidth title="Collections">
      <ResourcePicker
        resourceType="Collection"
        open={open}
        onSelection={(resources) => handleSelection(resources)}
        onCancel={() => setOpen(false)}
      />
      <Layout>
        <EmptyState
          image={notFoundImage}
          heading="Start collecting appointments on your store."
          action={{
            content: 'Choose collections',
            onAction: () => setOpen(true),
          }}>
          <p>
            Choose collection(s) from your store, and we'll transform it to
            category and its products into treatments! 🚀
          </p>
        </EmptyState>
      </Layout>
    </Page>
  );
};

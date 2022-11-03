import { ResourcePicker, useNavigate } from '@shopify/app-bridge-react';
import { EmptyState, Layout, Page } from '@shopify/polaris';
import { useCallback, useState } from 'react';
import useSWR, { mutate, useSWRConfig } from 'swr';
import { notFoundImage } from '../../assets';
import { useAuthenticatedFetch } from '../../hooks';

export default () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const fetch = useAuthenticatedFetch();
  const { mutate } = useSWRConfig();

  const fetchData = useCallback(async (selections: string[]) => {
    await fetch('/api/admin/collections', {
      method: 'POST',
      body: JSON.stringify({ selections }),
      headers: { 'Content-Type': 'application/json' },
    });

    mutate('/api/admin/collections');
  }, []);

  const handleSelection = async (resources: Resources) => {
    const ids = resources.selection.map((s) => s.id);
    await fetchData(ids);
    setOpen(false);
  };

  const { data } = useSWR<CollectionsApi>(
    '/api/admin/collections',
    (apiURL: string) => fetch(apiURL).then((res: Response) => res.json())
  );

  if (data?.payload?.length > 0) {
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

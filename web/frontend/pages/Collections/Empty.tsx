import { ResourcePicker } from "@shopify/app-bridge-react";
import { EmptyState, Layout, Page } from "@shopify/polaris";
import { useCallback, useState } from "react";
import { notFoundImage } from "../../assets";
import { useAuthenticatedFetch } from "../../hooks";

export default () => {
  const [open, setOpen] = useState(false);
  const fetch = useAuthenticatedFetch();

  const fetchData = useCallback(async (selection: string[]) => {
    const response = await fetch("/api/admin/collections/update", {
      method: "POST",
      body: JSON.stringify({ selection }),
      headers: { "Content-Type": "application/json" },
    });
    const { payload } = await response.json();
  }, []);

  const handleSelection = async (resources: Resources) => {
    await fetchData(resources.selection.map((s) => s.id));
    setOpen(false);
  };

  return (
    <Page narrowWidth>
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
            content: "Choose collections",
            onAction: () => setOpen(true),
          }}
        >
          <p>
            Choose collection(s) from your store, and we'll transform it to
            category and its products into treatments! 🚀
          </p>
        </EmptyState>
      </Layout>
    </Page>
  );
};

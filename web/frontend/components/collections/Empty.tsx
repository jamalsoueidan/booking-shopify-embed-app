import { ResourcePicker, TitleBar } from "@shopify/app-bridge-react";
import { EmptyState, Layout, Page } from "@shopify/polaris";
import { useState } from "react";
import { notFoundImage } from "../../assets";
import { useAuthenticatedFetch } from "../../hooks";

export default () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const fetch = useAuthenticatedFetch();

  const handleSelection = async (resources) => {
    setOpen(false);
  };

  const handleCancel = async () => {
    setOpen(false);
  };

  return (
    <Page narrowWidth>
      <ResourcePicker
        resourceType="Collection"
        open={open}
        onSelection={(resources) => handleSelection(resources)}
        onCancel={() => handleCancel()}
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

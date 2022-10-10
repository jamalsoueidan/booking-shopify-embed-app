import { ResourcePicker, TitleBar } from "@shopify/app-bridge-react";
import { Card, Layout, Page, Stack, EmptyState } from "@shopify/polaris";

import { useState } from "react";

export default () => {
  const [open, setOpen] = useState(false);
  const handleSelection = async (resources) => {
    setOpen(false);
    const response = await fetch("/api/collections/list");
    console.log(response);
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
          heading="Ingen kategorier valgt"
          action={{
            content: "Vælge kategorier",
            onAction: () => setOpen(true),
          }}
        >
          <p>Vælge kategorier i første omgang</p>
        </EmptyState>
      </Layout>
    </Page>
  );
};

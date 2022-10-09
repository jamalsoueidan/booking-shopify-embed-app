import { ResourcePicker, TitleBar } from "@shopify/app-bridge-react";
import { EmptyState, Layout, Page } from "@shopify/polaris";
import { useState } from "react";
import { useAuthenticatedFetch } from "../hooks";
import { Testerne } from "../components/Testerne";

export default () => {
  const [open, setOpen] = useState(false);
  const fetch = useAuthenticatedFetch();

  const handleSelection = async (resources) => {
    setOpen(false);
    const response = await fetch("/api/collections/list");
    console.log(response);
  };

  return (
    <Page narrowWidth>
      <TitleBar title="App name" primaryAction={null} />
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
          <Testerne></Testerne>
        </EmptyState>
      </Layout>
    </Page>
  );
};

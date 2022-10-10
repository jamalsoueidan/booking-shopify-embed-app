import { ResourcePicker } from "@shopify/app-bridge-react";
import { Button } from "@shopify/polaris";
import { useState } from "react";
import { useAuthenticatedFetch } from "../../../hooks";

export default ({ collections }: { collections: Array<Collection> }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const fetch = useAuthenticatedFetch();

  const handleSelection = async (resources) => {
    console.log(resources);
    setOpen(false);
  };

  const handleCancel = async () => {
    setOpen(false);
  };

  return (
    <>
      <ResourcePicker
        resourceType="Collection"
        open={open}
        onSelection={(resources) => handleSelection(resources)}
        onCancel={() => handleCancel()}
      />
      <Button primary onClick={() => setOpen(true)}>
        Tilføj ny kategori
      </Button>
    </>
  );
};

import { ResourcePicker } from "@shopify/app-bridge-react";
import { Button } from "@shopify/polaris";
import { useCallback, useState } from "react";
import { useAuthenticatedFetch } from "../../../hooks";

export default ({
  collections,
  updateCollections,
}: {
  collections: Array<Collection>;
  updateCollections?: any;
}) => {
  const [open, setOpen] = useState(false);
  const fetch = useAuthenticatedFetch();

  const fetchData = useCallback(async (selection: string[]) => {
    const response = await fetch("/api/admin/collections/update", {
      method: "POST",
      body: JSON.stringify({ selection }),
      headers: { "Content-Type": "application/json" },
    });
    const { payload } = await response.json();
    updateCollections(payload);
  }, []);

  const handleSelection = async (resources: Resources) => {
    await fetchData(resources.selection.map((s) => s.id));
    setOpen(false);
  };

  return (
    <>
      <ResourcePicker
        resourceType="Collection"
        open={open}
        onSelection={(resources) => handleSelection(resources)}
        onCancel={() => setOpen(false)}
        selectMultiple={false}
      />
      <Button primary onClick={() => setOpen(true)}>
        Tilføj flere kategorier
      </Button>
    </>
  );
};

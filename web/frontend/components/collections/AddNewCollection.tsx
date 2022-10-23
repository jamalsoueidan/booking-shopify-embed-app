import { ResourcePicker } from "@shopify/app-bridge-react";
import { Button } from "@shopify/polaris";
import { useCallback, useState } from "react";
import { useAuthenticatedFetch } from "../../hooks";

interface Props {
  open: boolean;
  setOpen: any;
}

export default ({ open, setOpen }: Props) => {
  const fetch = useAuthenticatedFetch();

  const fetchData = useCallback(async (selection: string[]) => {
    const response = await fetch("/api/admin/collections/update", {
      method: "POST",
      body: JSON.stringify({ selection }),
      headers: { "Content-Type": "application/json" },
    });
    const { payload } = await response.json();
    console.log(payload);
  }, []);

  const handleSelection = async (resources: Resources) => {
    await fetchData(resources.selection.map((s) => s.id));
    setOpen(false);
  };

  return (
    <ResourcePicker
      resourceType="Collection"
      open={open}
      onSelection={(resources) => handleSelection(resources)}
      onCancel={() => setOpen(false)}
      selectMultiple={false}
    />
  );
};

import { ResourcePicker } from "@shopify/app-bridge-react";
import { useCallback } from "react";
import { useSWRConfig } from "swr";
import { useAuthenticatedFetch } from "../../hooks";

interface Props {
  open: boolean;
  setOpen: any;
}

export default ({ open, setOpen }: Props) => {
  const fetch = useAuthenticatedFetch();
  const { mutate } = useSWRConfig();

  const fetchData = useCallback(async (selections: string[]) => {
    await fetch("/api/admin/collections", {
      method: "POST",
      body: JSON.stringify({ selections }),
      headers: { "Content-Type": "application/json" },
    });
    mutate("/api/admin/collections");
  }, []);

  const handleSelection = async (resources: Resources) => {
    const ids = resources.selection.map((s) => s.id);
    await fetchData(ids);
    setOpen(false);
  };

  return (
    <ResourcePicker
      resourceType="Collection"
      open={open}
      onSelection={(resources) => handleSelection(resources)}
      onCancel={() => setOpen(false)}
    />
  );
};

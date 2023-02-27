import { LoadingPage, useCollection, useCollectionCreate, useTranslation } from "@jamalsoueidan/pkg.bsf";
import { ResourcePicker, useNavigate } from "@shopify/app-bridge-react";
import { SelectPayload } from "@shopify/app-bridge/actions/ResourcePicker";
import { Card, EmptyState, Page } from "@shopify/polaris";
import { useCallback, useMemo, useState } from "react";

export default () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { create, isFetching, isFetched } = useCollectionCreate();
  const { t } = useTranslation({ id: "collection-empty", locales });
  const { data } = useCollection();

  const handleSelection = useCallback(
    (resources: SelectPayload) => {
      const selections = resources.selection.map((s) => s.id);
      create({ selections });
      setOpen(false);
    },
    [create, setOpen],
  );

  const onCancel = useCallback(() => setOpen(false), []);

  const action = useMemo(
    () => ({
      content: t("choose_collections"),
      onAction: () => setOpen(true),
    }),
    [t],
  );

  if (isFetching) {
    return <LoadingPage title="Updating collections..." />;
  }

  if (data?.length > 0 || isFetched) {
    navigate("/collections");
    return <></>;
  }

  return (
    <Page fullWidth title={t("title")}>
      <ResourcePicker
        resourceType="Collection"
        open={open}
        onSelection={handleSelection}
        onCancel={onCancel}
      />
      <Card sectioned>
        <EmptyState
          image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
          heading={t("title")}
          action={action}>
          <p>{t("text")} 🚀</p>
        </EmptyState>
      </Card>
    </Page>
  );
};

const locales = {
  da: {
    choose_collections: "Vælge kollektion(er)",
    text: "Vælg kollektioner(er) fra din butik, og vi omdanner dem til kategori(er) og dens produkter!",
    title: "Begynd at tag imod reservationer i din butik.",
  },
  en: {
    choose_collections: "Choose collection(s)",
    text: "Choose collection(s) from your store, and we'll transform it to category and its products!",
    title: "Start collecting appointments on your store.",
  },
};

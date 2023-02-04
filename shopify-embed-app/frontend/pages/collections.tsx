import CollectionList from "@components/collections/collection-list";
import ResourcePicker from "@components/collections/resource-picker";
import { LoadingSpinner, useTranslation } from "@jamalsoueidan/bsf.bsf-pkg";
import { useCollection } from "@services";
import { useNavigate } from "@shopify/app-bridge-react";
import { Page } from "@shopify/polaris";
import { Suspense, useState } from "react";

export default () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { data } = useCollection();
  const { t } = useTranslation({ id: "collections", locales });

  if (data?.length === 0) {
    navigate("/collections/empty");
    return <></>;
  }

  return (
    <Page
      fullWidth
      title={t("title")}
      primaryAction={{
        content: t("add_collection"),
        onAction: () => setOpen(true),
      }}>
      <ResourcePicker open={open} setOpen={setOpen} />
      <Suspense fallback={<LoadingSpinner />}>
        <CollectionList collections={data} />
      </Suspense>
    </Page>
  );
};

const locales = {
  da: {
    add_collection: "Tilføj kategori",
    title: "Kategorier",
  },
  en: {
    add_collection: "Add Category",
    title: "Categories",
  },
};

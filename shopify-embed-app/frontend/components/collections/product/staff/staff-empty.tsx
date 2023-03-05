import { useTranslation } from "@jamalsoueidan/pkg.frontend";
import { EmptyState } from "@shopify/polaris";

interface StaffEmptyStateProps {
  action: () => void;
}

export const StaffEmptyState = ({ action }: StaffEmptyStateProps) => {
  const { t } = useTranslation({
    id: "collections-staff-empty",
    locales: {
      da: {
        browse: "Vælge",
        title: "Der er ikke tilføjet brugere endnu.",
      },
      en: {
        browse: "Browse",
        title: "There is no staff added yet.",
      },
    },
  });

  return (
    <>
      <br />
      <EmptyState
        heading={t("title")}
        image="https://cdn.shopify.com/s/files/1/2376/3301/products/emptystate-files.png"
        fullWidth
        action={{ content: t("browse"), onAction: action }}
      />
    </>
  );
};

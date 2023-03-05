import {
  Product,
  ProductServiceUpdateBodyStaffProperty,
} from "@jamalsoueidan/pkg.backend-types";
import { useTranslation } from "@jamalsoueidan/pkg.frontend";
import { Card } from "@shopify/polaris";
import { DynamicList } from "@shopify/react-form/build/ts/hooks/list/dynamiclist";
import { Suspense, lazy, memo, useCallback, useState } from "react";
import FormContext from "./staff/form-context";
import { StaffList } from "./staff/staff-list";

const StaffModal = lazy(() => import("./staff/staff-modal"));

interface StaffCardProps {
  product: Product<ProductServiceUpdateBodyStaffProperty>;
  form: DynamicList<ProductServiceUpdateBodyStaffProperty>;
}

export default memo(({ product, form }: StaffCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation({
    id: "product-staff",
    locales: {
      da: {
        title: "Tilføj medarbejder",
      },
      en: {
        title: "Add staff",
      },
    },
  });

  const show = useCallback(() => setShowModal(() => true), []);
  const hide = useCallback(() => setShowModal(() => false), []);

  return (
    <FormContext.Provider value={form}>
      <Card title={t("title")}>
        <StaffList action={show} />
        <Suspense>
          <StaffModal productId={product._id} show={showModal} close={hide} />
        </Suspense>
      </Card>
    </FormContext.Provider>
  );
});

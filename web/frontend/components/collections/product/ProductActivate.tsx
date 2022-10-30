import { Banner, Layout, SettingToggle, TextStyle } from "@shopify/polaris";
import { useCallback, useState } from "react";
import { updateProduct } from "../../../services/product";

export default ({ product }: { product: Product }) => {
  const handleSubmit = updateProduct(product._id);

  const handleToggle = useCallback(() => {
    handleSubmit({
      active: !product.active,
    });
  }, [product]);

  const contentStatus = product.active ? "Deaktivere" : "Aktivere";
  const textStatus = product.active ? "books" : "ikke books";

  const banner =
    product.staff.length === 0
      ? {
          status: "warning",
          title: "Tilføj staff til produktet",
          errors: [{ message: "Tilføj staff til produktet" }],
        }
      : {};

  return (
    <Layout>
      {banner.title && (
        <Layout.Section>
          <Banner title={banner.title} status={banner.status}>
            <p>
              Før denne service kan aktiveres, skal du først tilføje medarbejder
              til produktet
            </p>
            <ul>
              {banner.errors.map(({ message }, i) => (
                <li key={i}>{message}</li>
              ))}
            </ul>
          </Banner>
        </Layout.Section>
      )}
      <Layout.Section>
        <SettingToggle
          action={{
            content: contentStatus,
            onAction: handleToggle,
            disabled: product.staff.length === 0,
          }}
          enabled={product.active}
        >
          Dette product kan{" "}
          <TextStyle variation="strong">{textStatus}</TextStyle> online.
        </SettingToggle>
      </Layout.Section>
    </Layout>
  );
};

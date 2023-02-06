import { Product } from "@jamalsoueidan/bsb.types";
import { useProducts } from "@services/product";
import { Select } from "@shopify/polaris";
import { Field } from "@shopify/react-form";
import { useCallback, useMemo } from "react";
export const ProductSelect = (field: Field<number>) => {
  const { data } = useProducts();

  const productOptions = useMemo(
    () =>
      data?.map((o: Product) => ({
        key: o._id,
        label: o.title,
        value: o.productId.toString(),
      })) || [],

    [data],
  );

  const onChange = useCallback(
    (selected: string) => {
      field.onChange(parseInt(selected));
    },
    [field],
  );

  return (
    <Select
      label="Vælg produkt"
      placeholder="Vælg produkt"
      options={productOptions}
      value={field.value?.toString()}
      disabled={productOptions.length === 1}
      onChange={onChange}
      onBlur={field.onBlur}
      error={field.error}
    />
  );
};

import { useProducts } from '@services/product';
import { Select, SelectOption } from '@shopify/polaris';
import { Field } from '@shopify/react-form';
import { useCallback, useMemo } from 'react';

const defaultOption: SelectOption = {
  key: 'vælg produkt',
  label: 'Vælg produkt',
  value: undefined,
} as any;

export const ProductSelect = (field: Field<number>) => {
  const { data } = useProducts();

  const productOptions = useMemo(() => {
    const all =
      data?.map((o) => ({
        key: o._id,
        label: o.title,
        value: o.productId.toString(),
      })) || [];

    return [defaultOption, ...all];
  }, [data]);

  const onChange = useCallback(
    (selected: string) => {
      field.onChange(parseInt(selected));
    },
    [field.onChange]
  );

  return (
    <Select
      label="Vælg produkt"
      options={productOptions}
      value={field.value?.toString()}
      disabled={productOptions.length === 1}
      onChange={onChange}
      onBlur={field.onBlur}
      error={field.error}
    />
  );
};

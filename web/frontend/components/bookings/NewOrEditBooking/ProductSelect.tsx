import { useProducts } from '@services/product';
import { Select } from '@shopify/polaris';
import { Field } from '@shopify/react-form';
import { useCallback, useMemo } from 'react';

export const ProductSelect = (field: Field<number>) => {
  const { data } = useProducts();

  const productOptions = useMemo(() => {
    const all =
      data?.map((o) => ({
        key: o._id,
        label: o.title,
        value: o.productId.toString(),
      })) || [];

    return [{ key: '-', label: 'Vælg produkt', value: '' }, ...all];
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
      {...field}
      value={field.value?.toString()}
      onChange={onChange}
    />
  );
};

import { Product } from "@jamalsoueidan/pkg.backend-types";
import { Card, Select } from "@shopify/polaris";
import { FieldDictionary } from "@shopify/react-form";
import { memo, useCallback, useMemo } from "react";

interface FormFields extends FieldDictionary<Pick<Product, "active">> {
  staffLength: number;
}

export default memo(({ active, staffLength }: FormFields) => {
  const onChange = useCallback(
    (value: string) => {
      active.onChange(value === "true" ? true : false);
    },
    [active],
  );

  const options = useMemo(
    () => [
      {
        label: "Activate",
        value: "true",
      },
      {
        label: "Deactivate",
        value: "false",
      },
    ],
    [],
  );

  return (
    <Card sectioned title="Product status">
      <Select
        label=""
        options={options}
        onChange={onChange}
        value={active.value ? "true" : "false"}
        disabled={staffLength === 0}
        onBlur={active.onBlur}
      />
    </Card>
  );
});

import { Customer } from "@jamalsoueidan/bsb.types";
import { InputAutoComplete, InputAutoCompleteInput, InputAutoCompleteOption } from "@jamalsoueidan/bsf.bsf-pkg";
import { useCustomer } from "@services/customer";
import { Icon } from "@shopify/polaris";
import { CustomersMajor } from "@shopify/polaris-icons";
import { Field } from "@shopify/react-form";
import { useCallback, useEffect, useMemo, useState } from "react";

export type CustomerAutoDompleteField = { customerId: number; fullName: string };

export interface CustomerAutoCompleteProps {
  field: Field<CustomerAutoDompleteField>;
  input?: InputAutoCompleteInput;
}

export const CustomerInputAutoComplete = ({ field }: CustomerAutoCompleteProps) => {
  const { find } = useCustomer();
  const [options, setOptions] = useState<Array<InputAutoCompleteOption>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const convertToOptions = useCallback(
    async (value: string) => {
      setLoading(true);
      const results = await find(value);
      setOptions(
        results?.map((r: Customer) => ({
          label: `${r.firstName} ${r.lastName}`,
          value: r.customerId.toString(),
        })),
      );
      setLoading(false);
    },
    [find],
  );

  useEffect(() => {
    convertToOptions("a");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSelect = useCallback(
    (option: InputAutoCompleteOption) => {
      field.onChange({
        customerId: parseInt(option.value.toString(), 10),
        fullName: option.label,
      });
    },
    [field],
  );

  const onSearch = useCallback(
    (value: string | null) => {
      convertToOptions(value || "a");
    },
    [convertToOptions],
  );

  const selectedOption = useMemo(
    () => options.find((o) => o.value === field.value?.customerId?.toString()),
    [field.value?.customerId, options],
  );

  return (
    <InputAutoComplete
      options={options}
      onSelect={onSelect}
      onSearch={onSearch}
      selectedOption={selectedOption}
      input={{ error: field.error, icon: <Icon source={CustomersMajor} color="base" />, loading }}
    />
  );
};

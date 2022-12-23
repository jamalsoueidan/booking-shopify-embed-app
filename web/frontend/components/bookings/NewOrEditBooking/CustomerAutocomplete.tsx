import { Autocomplete, Icon } from '@shopify/polaris';
import { CustomerPlusMajor } from '@shopify/polaris-icons';
import { useState, useCallback, useMemo } from 'react';
import { Field } from '@shopify/react-form';
import { useCustomer } from '@services/customer';

export const CustomerAutocomplete = (field: Field<number>) => {
  const { find } = useCustomer();
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const updateText = useCallback(
    async (value: string) => {
      setInputValue(value);

      if (!loading) {
        setLoading(true);
      }

      if (value === '') {
        setOptions([]);
        setLoading(false);
        return;
      }

      const results = await find(value);
      setOptions(
        results?.map((r) => ({
          label: `${r.firstName} ${r.lastName}`,
          value: r.customerId.toString(),
        }))
      );
      setLoading(false);
    },
    [loading]
  );

  const updateSelection = useCallback(
    (selected: Array<string>) => {
      const selectedText = selected.map((selectedItem) => {
        const matchedOption = options.find((option) => {
          return option.value.match(selectedItem);
        });
        return matchedOption && matchedOption.label;
      });
      field.onChange(parseInt(selected[0]));
      setInputValue(selectedText[0]);
    },
    [field.onChange, options]
  );

  const textField = useMemo(
    () => (
      <Autocomplete.TextField
        onChange={updateText}
        label="Choose Customer"
        value={inputValue}
        prefix={<Icon source={CustomerPlusMajor} color="base" />}
        placeholder="No customer selected"
        autoComplete="off"
      />
    ),
    [inputValue, updateText]
  );

  return (
    <Autocomplete
      options={options}
      selected={[field.value?.toString()]}
      onSelect={updateSelection}
      loading={loading}
      textField={textField}
    />
  );
};

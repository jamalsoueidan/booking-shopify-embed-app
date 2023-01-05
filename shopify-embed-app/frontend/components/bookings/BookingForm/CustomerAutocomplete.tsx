import { useCustomer } from '@services/customer';
import { Autocomplete, Icon, InlineError, Text } from '@shopify/polaris';
import { CustomerPlusMajor } from '@shopify/polaris-icons';
import { Field } from '@shopify/react-form';
import { useCallback, useEffect, useMemo, useState } from 'react';

export const CustomerAutocomplete = (
  field: Field<{ customerId: number; fullName: string }>
) => {
  const { find } = useCustomer();
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const setNewOptions = useCallback(async (value: string) => {
    const results = await find(value);
    setOptions(
      results?.map((r) => ({
        label: `${r.firstName} ${r.lastName}`,
        value: r.customerId.toString(),
      }))
    );
  }, []);

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

      setNewOptions(value);
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
      field.onChange({
        customerId: parseInt(selected[0]),
        fullName: selectedText[0],
      });
      setInputValue(selectedText[0]);
    },
    [field.onChange, options]
  );

  useEffect(() => {
    setNewOptions('a');
  }, []);

  useEffect(() => {
    if (!field.dirty) {
      setInputValue(field.defaultValue?.fullName);
    }
  }, [field.dirty]);

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
    <>
      <Autocomplete
        options={options}
        selected={[field.value?.toString()]}
        onSelect={updateSelection}
        loading={loading}
        textField={textField}
      />
      {field.error ? (
        <InlineError
          message={field.error}
          fieldID="errorCustomerAutoComplete"
        />
      ) : null}
      <div style={{ marginTop: 'var(--p-space-1)' }}>
        <Text variant="bodyMd" as="p" color="subdued">
          Start med at udfylde feltet, så kommer der valgmuligheder frem.
        </Text>
      </div>
    </>
  );
};

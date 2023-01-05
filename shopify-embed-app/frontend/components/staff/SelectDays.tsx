import { Autocomplete, InlineError, Stack, Tag } from '@shopify/polaris';
import { Field } from '@shopify/react-form';
import { useCallback, useMemo, useState } from 'react';

interface ComboxListDaysProps {
  days: Field<string[]>;
}
export const SelectDays = ({ days }: ComboxListDaysProps) => {
  const deselectedOptions = useMemo(
    () => [
      { value: 'monday', label: 'Monday' },
      { value: 'tuesday', label: 'Tuesday' },
      { value: 'wednesday', label: 'Wednesday' },
      { value: 'thursday', label: 'Thursday' },
      { value: 'friday', label: 'Friday' },
      { value: 'saturday', label: 'Saturday' },
      { value: 'sunday', label: 'Sunday' },
    ],
    []
  );
  const [inputValue, setInputValue] = useState('');
  const [options, setOptions] = useState(deselectedOptions);

  const updateText = useCallback(
    (value: string) => {
      setInputValue(value);

      if (value === '') {
        setOptions(deselectedOptions);
        return;
      }

      const filterRegex = new RegExp(value, 'i');
      const resultOptions = deselectedOptions.filter((option) =>
        option.label.match(filterRegex)
      );
      setOptions(resultOptions);
    },
    [deselectedOptions]
  );

  const removeTag = useCallback(
    (tag: string) => () => {
      const options = [...days.value];
      options.splice(options.indexOf(tag), 1);
      days.onChange(options);
    },
    [days.value]
  );

  const verticalContentMarkup =
    days.value.length > 0 ? (
      <Stack spacing="extraTight" alignment="center">
        {days.value.map((option) => {
          let tagLabel = '';
          tagLabel = option.replace('_', ' ');
          tagLabel = titleCase(tagLabel);
          return (
            <Tag key={`option${option}`} onRemove={removeTag(option)}>
              {tagLabel}
            </Tag>
          );
        })}
      </Stack>
    ) : null;

  const textField = (
    <Autocomplete.TextField
      autoComplete="off"
      onChange={updateText}
      label="Select days"
      value={inputValue}
      placeholder="Select days..."
      verticalContent={verticalContentMarkup}
    />
  );

  return (
    <>
      <Autocomplete
        allowMultiple
        options={options}
        selected={days.value}
        textField={textField}
        onSelect={days.onChange}
      />
      <InlineError message={days.error} fieldID={''} />
    </>
  );

  function titleCase(string: string) {
    return string
      .toLowerCase()
      .split(' ')
      .map((word) => word.replace(word[0], word[0].toUpperCase()))
      .join('');
  }
};

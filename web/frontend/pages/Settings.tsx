import {
  Banner,
  Button,
  Card,
  Form,
  FormLayout,
  Page,
  Select,
} from '@shopify/polaris';
import { useField, useForm } from '@shopify/react-form';
import TimezoneSelect from 'react-timezone-select';
import useSetting from '@services/setting';

const languageOptions = [
  { label: 'English', value: 'en' },
  { label: 'Danish', value: 'da' },
];

export default () => {
  const { data, update } = useSetting();

  //https://codesandbox.io/s/1wpxz?file=/src/MyForm.tsx:2457-2473
  const { fields, submit, submitErrors, submitting, dirty } = useForm({
    fields: {
      timeZone: useField({
        value: data.timeZone,
        validates: [],
      }),
      language: useField({
        value: data.language,
        validates: [],
      }),
    },
    onSubmit: async (fieldValues) => {
      await update(fieldValues);
      return { status: 'success' as const };
    },
  });

  return (
    <Page narrowWidth title="Store settings" subtitle="Timezone and localize">
      {submitErrors.length > 0 && (
        <Banner status="critical">
          <p>Errors</p>
          <ul>
            {submitErrors.map(({ message }, i) => (
              <li key={i}>{message}</li>
            ))}
          </ul>
        </Banner>
      )}
      <Card sectioned>
        <Form onSubmit={submit}>
          <FormLayout>
            <div style={{ zIndex: 99, position: 'relative' }}>
              <TimezoneSelect
                value={{
                  value: fields.timeZone.value,
                  label: fields.timeZone.value,
                }}
                onChange={(timezone) =>
                  fields.timeZone.onChange(timezone.value)
                }
              />
            </div>
            <Select
              label="Language"
              options={languageOptions}
              {...fields.language}
            />
            <Button submit primary loading={submitting} disabled={!dirty}>
              Save
            </Button>
          </FormLayout>
        </Form>
      </Card>
    </Page>
  );
};

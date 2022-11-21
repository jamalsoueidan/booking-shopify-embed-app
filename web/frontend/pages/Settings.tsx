import { useSettingGet, useSettingUpdate } from '@services/setting';
import {
  Banner,
  Card,
  Form,
  FormLayout,
  Layout,
  Page,
  PageActions,
  Select,
  Stack,
} from '@shopify/polaris';
import { useField, useForm } from '@shopify/react-form';
import { useTranslation } from 'react-i18next';
import TimezoneSelect from 'react-timezone-select';

export default () => {
  const { data } = useSettingGet();
  const { update } = useSettingUpdate();

  const { t } = useTranslation('settings');

  const languageOptions = [
    {
      label: t('store_settings.language.english'),
      value: 'en',
    },
    { label: t('store_settings.language.danish'), value: 'da' },
  ];

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

  const primaryAction = {
    content: 'Save',
    loading: submitting,
    disabled: !dirty,
    onAction: submit,
  };

  return (
    <Page title={t('title')} primaryAction={primaryAction}>
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
      <Form onSubmit={submit}>
        <Layout>
          <Layout.AnnotatedSection
            title={t('store_settings.title')}
            description={t('store_settings.subtitle')}>
            <Card sectioned>
              <FormLayout>
                <Stack vertical spacing="extraTight">
                  <Stack.Item>Price</Stack.Item>
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
                </Stack>
                <Select
                  label="Language"
                  options={languageOptions}
                  {...fields.language}
                />
              </FormLayout>
            </Card>
          </Layout.AnnotatedSection>
        </Layout>
      </Form>
      <PageActions primaryAction={primaryAction} />
    </Page>
  );
};

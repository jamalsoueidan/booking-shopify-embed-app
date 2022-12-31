import { FormErrors } from '@components/FormErrors';
import LoadingPage from '@components/LoadingPage';
import { TimeZoneSelect } from '@components/settings/TimeZoneSelect';
import { useExtendForm, useTranslation } from '@hooks';
import { useToast } from '@providers/toast';
import { useSetting, useSettingUpdate } from '@services';
import {
  Card,
  Form,
  FormLayout,
  Layout,
  Page,
  PageActions,
  Select,
  SettingToggle,
  Text,
} from '@shopify/polaris';
import { useField } from '@shopify/react-form';

export default () => {
  const { data } = useSetting();
  const { update } = useSettingUpdate();

  const { t } = useTranslation('settings');

  const { show } = useToast();

  const languageOptions = [
    {
      label: t('store_settings.language.options.english'),
      value: 'en-US',
    },
    {
      label: t('store_settings.language.options.danish'),
      value: 'da-DK',
    },
  ];

  //https://codesandbox.io/s/1wpxz?file=/src/MyForm.tsx:2457-2473
  const { fields, submit, submitErrors, primaryAction } = useExtendForm({
    fields: {
      timeZone: useField<string>({
        value: data?.timeZone,
        validates: [],
      }),
      language: useField<string>({
        value: data?.language,
        validates: [],
      }),
      status: useField<boolean>({
        value: data?.status,
        validates: [],
      }),
    },
    onSubmit: async (fieldValues) => {
      await update(fieldValues);
      show({ content: t('toast') });
      return { status: 'success' };
    },
  });

  if (!data) {
    return <LoadingPage title="Loading settings data" />;
  }

  return (
    <Form onSubmit={submit}>
      <Page fullWidth title={t('title')}>
        <Layout>
          <FormErrors errors={submitErrors} />
          <Layout.AnnotatedSection
            title={t('store_settings.title')}
            description={t('store_settings.subtitle')}>
            <Card sectioned>
              <FormLayout>
                <TimeZoneSelect
                  label={t('store_settings.timezone.label')}
                  {...fields.timeZone}
                />
                <Select
                  label={t('store_settings.language.label')}
                  options={languageOptions}
                  {...fields.language}
                />
              </FormLayout>
            </Card>
          </Layout.AnnotatedSection>
          <Layout.AnnotatedSection
            title={t('store_status.title')}
            description={t('store_status.subtitle')}>
            <Card sectioned>
              <FormLayout>
                <SettingToggle
                  action={{
                    content: fields.status.value
                      ? t('store_status.status.disable')
                      : t('store_status.status.enable'),
                    onAction: () =>
                      fields.status.onChange(!fields.status.value),
                  }}
                  enabled={fields.status.value}>
                  <Text variant="bodyMd" fontWeight="bold" as="span">
                    {fields.status.value
                      ? t('store_status.status.enabled')
                      : t('store_status.status.disabled')}
                  </Text>
                  .
                </SettingToggle>
              </FormLayout>
            </Card>
          </Layout.AnnotatedSection>
        </Layout>
        <br />
        <PageActions primaryAction={primaryAction} />
      </Page>
    </Form>
  );
};

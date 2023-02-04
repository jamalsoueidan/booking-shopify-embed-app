import { FormErrors } from "@components/FormErrors";
import {
  InputLanguage,
  InputTimeZone,
  LoadingPage,
  useForm,
  useToast,
  useTranslation,
} from "@jamalsoueidan/bsf.bsf-pkg";
import { useSetting, useSettingUpdate } from "@services";
import {
  Card,
  Form,
  FormLayout,
  Layout,
  Page,
  PageActions,
  SettingToggle,
  Text,
} from "@shopify/polaris";
import { useField } from "@shopify/react-form";

export const SettingsApplication = () => {
  const { data } = useSetting();
  const { update } = useSettingUpdate();

  const { t } = useTranslation({ id: "settings-application", locales });

  const { show } = useToast();

  //https://codesandbox.io/s/1wpxz?file=/src/MyForm.tsx:2457-2473
  const { fields, submit, submitErrors, primaryAction } = useForm({
    fields: {
      language: useField<string>({
        validates: [],
        value: data?.language || "en-US",
      }),
      status: useField<boolean>({
        validates: [],
        value: data?.status,
      }),
      timeZone: useField<string>({
        validates: [],
        value: data?.timeZone,
      }),
    },
    onSubmit: async (fieldValues) => {
      await update(fieldValues);
      show({ content: t("toast") });
      return { status: "success" };
    },
  });

  if (!data) {
    return <LoadingPage title="Loading settings data" />;
  }

  return (
    <Form onSubmit={submit}>
      <Page fullWidth title={t("title")}>
        <Layout>
          <FormErrors errors={submitErrors} />
          <Layout.AnnotatedSection
            title={t("store_settings.title")}
            description={t("store_settings.subtitle")}>
            <Card sectioned>
              <FormLayout>
                <InputTimeZone {...fields.timeZone} />
                <InputLanguage {...fields.language} />
              </FormLayout>
            </Card>
          </Layout.AnnotatedSection>
          <Layout.AnnotatedSection
            title={t("store_status.title")}
            description={t("store_status.subtitle")}>
            <Card sectioned>
              <FormLayout>
                <SettingToggle
                  action={{
                    content: fields.status.value
                      ? t("status.disable")
                      : t("status.enable"),
                    onAction: () =>
                      fields.status.onChange(!fields.status.value),
                  }}
                  enabled={fields.status.value}>
                  <Text variant="bodyMd" fontWeight="bold" as="span">
                    {fields.status.value
                      ? t("status.enabled")
                      : t("status.disabled")}
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

const locales = {
  da: {
    status: {
      disable: "Deaktivere",
      disabled: "App er deaktiveret",
      enable: "Aktivere",
      enabled: "App er aktiveret",
    },
    store_settings: {
      subtitle: "Tidszone og sprog",
      title: "Butiksindstillinger",
    },
    store_status: {
      subtitle: "Deaktiver reservationer på online butik.",
      title: "App Status",
    },
    title: "Indstillinger",
    toast: "Indstillinger er opdateret",
  },
  en: {
    status: {
      disable: "Disable",
      disabled: "App is disabled",
      enable: "Enable",
      enabled: "App is enabled",
    },
    store_settings: {
      subtitle: "Time zone and locale",
      title: "Store settings",
    },
    store_status: {
      subtitle: "Disable bookings on the storefront.",
      title: "App Status",
    },
    title: "Settings",
    toast: "Settings has been updated",
  },
};

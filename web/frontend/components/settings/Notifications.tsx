import { FormErrors } from '@components/FormErrors';
import { useExtendForm } from '@hooks/useExtendForm';
import { useTranslation } from '@hooks/useTranslation';
import { useToast } from '@providers/toast';
import {
  useNotificationTemplates,
  useNotificationTemplatesUpdate,
} from '@services';
import {
  Card,
  Form,
  Layout,
  Page,
  PageActions,
  TextField,
} from '@shopify/polaris';
import { FieldDictionary, useDynamicList } from '@shopify/react-form';

export default () => {
  const { data } = useNotificationTemplates();
  const { show } = useToast();
  const { update } = useNotificationTemplatesUpdate();
  const { t } = useTranslation('settings', { keyPrefix: 'notifications' });

  const {
    submit,
    submitErrors,
    dynamicLists: { notificationTemplates },
    primaryAction,
  } = useExtendForm({
    fields: null,
    dynamicLists: {
      notificationTemplates: useDynamicList<NotificationTemplate>(
        data || [],
        (nt: NotificationTemplate) => nt
      ),
    },
    onSubmit: async (fieldValues) => {
      await update(fieldValues.notificationTemplates);
      show({ content: 'Notification has been updated' });
      return { status: 'success' };
    },
  });

  return (
    <Form onSubmit={submit}>
      <Page fullWidth title="Beskeder">
        <Layout>
          <FormErrors errors={submitErrors} />
          {notificationTemplates.fields.map(
            (field: FieldDictionary<NotificationTemplate>) => (
              <Layout.AnnotatedSection
                key={field._id.value}
                title={t(`${field.name.value.toLowerCase()}.title`)}
                description={t(
                  `${field.name.value.toLowerCase()}.description`
                )}>
                <Card sectioned>
                  <TextField
                    label={t(`${field.name.value.toLowerCase()}.label`)}
                    autoComplete="false"
                    {...field.message}
                  />
                </Card>
              </Layout.AnnotatedSection>
            )
          )}
        </Layout>
        <br />
        <PageActions primaryAction={primaryAction} />
      </Page>
    </Form>
  );
};

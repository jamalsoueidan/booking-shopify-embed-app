import { FormErrors } from '@components/FormErrors';
import LoadingSpinner from '@components/LoadingSpinner';
import { useExtendForm } from '@hooks/useExtendForm';
import { useTranslation } from '@hooks/useTranslation';
import { useToast } from '@providers/toast';
import {
  useNotificationTemplates,
  useNotificationTemplatesUpdate,
} from '@services';
import {
  Card,
  DescriptionList,
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
        <FormErrors errors={submitErrors} />

        <Layout>
          <Layout.AnnotatedSection
            title="Customize beskederne"
            description="Brug følgende i beskederne for at redigere dynamisk værdier">
            <Card sectioned>
              <DescriptionList
                items={[
                  {
                    term: '{fullname}',
                    description:
                      'Fuldnavn på kunde eller medarbejder, eksempel: jamal soueidan',
                  },
                  {
                    term: '{total}',
                    description: 'Antal behandlinger, eksempel: 2',
                  },
                  {
                    term: '{time}',
                    description:
                      'Tid tilbage til behandling start, eksempel: imorgen kl 12:00',
                  },
                  {
                    term: '{title}',
                    description: 'Behandlinger title, eksempel: hårfarve',
                  },
                ]}
              />
            </Card>
          </Layout.AnnotatedSection>
          {!data ? (
            <LoadingSpinner />
          ) : (
            notificationTemplates.fields.map(
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
            )
          )}
        </Layout>
        <br />
        <PageActions primaryAction={primaryAction} />
      </Page>
    </Form>
  );
};

import { useExtendForm } from '@hooks/useExtendForm';
import { useToast } from '@providers/toast';
import {
  useNotificationTemplates,
  useNotificationTemplatesUpdate,
} from '@services';
import {
  Form,
  FormLayout,
  Page,
  PageActions,
  TextField,
} from '@shopify/polaris';
import { FieldDictionary, useDynamicList } from '@shopify/react-form';

export default () => {
  const { data } = useNotificationTemplates();
  const { show } = useToast();
  const { update } = useNotificationTemplatesUpdate();

  const {
    submit,
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
        <FormLayout>
          {notificationTemplates.fields.map(
            (field: FieldDictionary<NotificationTemplate>) => (
              <TextField
                key={field._id.value}
                label={field.name.value}
                autoComplete="false"
                multiline
                {...field.message}
              />
            )
          )}
        </FormLayout>
        <br />
        <PageActions primaryAction={primaryAction} />
      </Page>
    </Form>
  );
};

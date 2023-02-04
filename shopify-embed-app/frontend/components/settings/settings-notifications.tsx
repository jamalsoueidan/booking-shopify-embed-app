import { NotificationTemplate } from "@jamalsoueidan/bsb.mongodb.types";
import {
  FormErrors,
  LoadingSpinner,
  useForm,
  useSettings,
  useToast,
  useTranslation,
} from "@jamalsoueidan/bsf.bsf-pkg";
import {
  useNotificationTemplates,
  useNotificationTemplatesUpdate,
} from "@services";
import {
  Box,
  Card,
  DescriptionList,
  Form,
  Layout,
  Page,
  PageActions,
  TextField,
} from "@shopify/polaris";
import { FieldDictionary, useDynamicList } from "@shopify/react-form";

export const SettingsNotifications = () => {
  const { language } = useSettings();
  const { data } = useNotificationTemplates({ language });
  const { show } = useToast();
  const { update } = useNotificationTemplatesUpdate();
  const { tdynamic } = useTranslation({ id: "settings-notification", locales });

  const {
    submit,
    submitErrors,
    dynamicLists: { notificationTemplates },
    primaryAction,
  } = useForm({
    dynamicLists: {
      notificationTemplates: useDynamicList<NotificationTemplate>(
        data || [],
        (nt: NotificationTemplate) => nt,
      ),
    },
    fields: null,
    onSubmit: async (fieldValues) => {
      await update(fieldValues.notificationTemplates);
      show({ content: "Notification has been updated" });
      return { status: "success" };
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
                    description:
                      "Fuldnavn på kunde eller medarbejder, eksempel: jamal soueidan",
                    term: "{fullname}",
                  },
                  {
                    description: "Behandlinger title, eksempel: hårfarve",
                    term: "{title}",
                  },
                  {
                    description:
                      "Tid tilbage til behandling start, eksempel: imorgen kl 12:00",
                    term: "{time}",
                  },
                  {
                    description:
                      "Dato til behandling tid, eksempel: 2. Januar - 11:23",
                    term: "{date}",
                  },
                  {
                    description: "Antal behandlinger, eksempel: 2",
                    term: "{total}",
                  },
                ]}
              />
            </Card>
          </Layout.AnnotatedSection>
          {!data ? (
            <Box paddingBlockStart="8">
              <LoadingSpinner />
            </Box>
          ) : (
            notificationTemplates.fields.map(
              (field: FieldDictionary<NotificationTemplate>) => (
                <Layout.AnnotatedSection
                  key={field._id.value}
                  title={tdynamic(`${field.name.value.toLowerCase()}.title`)}
                  description={tdynamic(
                    `${field.name.value.toLowerCase()}.description`,
                  )}>
                  <Card sectioned>
                    <TextField
                      label={tdynamic(
                        `${field.name.value.toLowerCase()}.label`,
                      )}
                      autoComplete="false"
                      {...field.message}
                    />
                  </Card>
                </Layout.AnnotatedSection>
              ),
            )
          )}
        </Layout>
        <br />
        <PageActions primaryAction={primaryAction} />
      </Page>
    </Form>
  );
};

const locales = {
  da: {
    booking_confirmation: {
      description:
        "SMS bliver sendt som en bekræftelse på vi har modtaget hans bestilling.",
      label: "Bestillingsbekræftelse",
      title: "Bestillingsbekræftelse",
    },
    booking_reminder_customer: {
      description:
        "Kunde modtager en påmindelse besked en dag før reservationen.",
      label: "Kunde bestillingspåmindelse",
      title: "Kunde bestillingspåmindelse",
    },
    booking_reminder_staff: {
      description:
        "Medarbejder modtager en påmindelse besked en dag før reservationen.",
      label: "Medarbejder bestillings påmindelse",
      title: "Medarbejder bestillings påmindelse",
    },
    booking_update: {
      description: "Når en bestilling bliver opdateret",
      label: "Kunde bestillingsopdatering",
      title: "Kunde bestillingsopdatering",
    },
  },
  en: {
    booking_confirmation: {
      description: "SMS sent as confirmation for we received his booking.",
      label: "Booking confirmation",
      title: "Booking confirmation",
    },
    booking_reminder_customer: {
      description: "Customer receive message a day before the booking.",
      label: "Customer booking reminder",
      title: "Customer booking reminder",
    },
    booking_reminder_staff: {
      description: "Staff receive message a day before the booking.",
      label: "Staff booking reminder",
      title: "Staff booking reminder",
    },
    booking_update: {
      description: "When booking is updated",
      label: "Customer booking update",
      title: "Customer booking update",
    },
  },
};

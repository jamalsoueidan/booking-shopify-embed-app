import { FormErrors } from '@components/FormErrors';
import { useCustomForm, useTranslation } from '@hooks';
import {
  BreadcrumbsProps,
  Card,
  Form,
  FormLayout,
  Layout,
  Page,
  Text,
} from '@shopify/polaris';
import { useField } from '@shopify/react-form';
import { CustomerAutocomplete } from './CustomerAutocomplete';
import { ProductSelect } from './ProductSelect';
import { ScheduleDateSelect } from './ScheduleDateSelect';
import { ScheduleStaffSelect } from './ScheduleStaffSelect';
import { ScheduleTimerSelect } from './ScheduleTimerSelect';

interface StaffFormProps {
  action: (body: BookingBodyCreate) => void;
  breadcrumbs?: BreadcrumbsProps['breadcrumbs'];
  titleMetadata?: React.ReactNode;
  data?: BookingAggreate;
}

export const BookingForm = ({
  action,
  breadcrumbs,
  titleMetadata,
  data,
}: StaffFormProps) => {
  const { t } = useTranslation('bookings', { keyPrefix: 'new' });

  //https://codesandbox.io/s/1wpxz?file=/src/MyForm.tsx:2457-2473
  const { fields, submit, submitErrors } = useCustomForm({
    fields: {
      productId: useField({
        value: data?.productId || undefined,
        validates: [],
      }),
      customerId: useField({
        value: data?.customerId || undefined,
        validates: [],
      }),
      staff: useField({
        value: data?.staff?._id || undefined,
        validates: [],
      }),
      date: useField({
        value: data?.start ? new Date(data?.start) : undefined,
        validates: [],
      }),
      time: useField({
        value: { start: data?.start || undefined, end: data?.end || undefined },
        validates: [],
      }),
    },
    onSubmit: async (fieldValues) => {
      console.log(fieldValues);
      //action(fieldValues);
      return { status: 'success' };
    },
  });

  return (
    <Page
      title={t('title')}
      breadcrumbs={breadcrumbs}
      titleMetadata={titleMetadata}>
      <Form onSubmit={submit}>
        <Layout>
          <FormErrors errors={submitErrors} />
          <Layout.AnnotatedSection title={'Produkt'}>
            <Card sectioned>
              <FormLayout>
                <ProductSelect {...fields.productId} />
              </FormLayout>
            </Card>
          </Layout.AnnotatedSection>
          <Layout.AnnotatedSection title={'Kunde'}>
            <Card sectioned>
              <CustomerAutocomplete
                {...fields.customerId}></CustomerAutocomplete>
            </Card>
          </Layout.AnnotatedSection>
          <Layout.AnnotatedSection
            title={'Tidsbestilling'}
            description="Vælg medarbejder, dato og tid">
            <Card sectioned>
              {!fields.productId.value ? (
                <Text variant="bodyMd" as="p">
                  Vælg produkt for at gå igang med at udfylde resten af felterne
                </Text>
              ) : (
                <FormLayout>
                  <ScheduleStaffSelect
                    field={fields.staff}
                    productId={fields.productId.value}
                  />
                  <ScheduleDateSelect
                    field={fields.date}
                    staff={fields.staff.value}
                    productId={fields.productId.value}
                  />
                  <ScheduleTimerSelect
                    field={fields.time}
                    staff={fields.staff.value}
                    date={fields.date.value}
                    productId={fields.productId.value}
                  />
                </FormLayout>
              )}
            </Card>
          </Layout.AnnotatedSection>
        </Layout>
      </Form>
    </Page>
  );
};

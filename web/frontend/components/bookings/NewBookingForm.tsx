import { useCustomForm, useTranslation } from '@hooks';
import {
  BreadcrumbsProps,
  Card,
  Form,
  FormLayout,
  Layout,
  Page,
} from '@shopify/polaris';
import { notEmpty, useField } from '@shopify/react-form';
import {
  CustomerAutocomplete,
  ProductSelect,
  ScheduleDateSelect,
  ScheduleStaffSelect,
  ScheduleTimerSelect,
} from './BookingForm';

interface StaffFormProps {
  action: (body: BookingBodyCreate) => void;
  breadcrumbs?: BreadcrumbsProps['breadcrumbs'];
  titleMetadata?: React.ReactNode;
  data?: BookingAggreate;
}

export const NewBookingForm = ({
  action,
  breadcrumbs,
  titleMetadata,
  data,
}: StaffFormProps) => {
  const { t } = useTranslation('bookings', { keyPrefix: 'new' });

  //https://codesandbox.io/s/1wpxz?file=/src/MyForm.tsx:2457-2473
  const { fields, submit } = useCustomForm({
    fields: {
      productId: useField({
        value: data?.productId || undefined,
        validates: [notEmpty('Der er ikke valgt produkt')],
      }),
      customerId: useField({
        value: {
          customerId: data?.customerId || undefined,
          fullName: data?.customer.fullname || undefined,
        },
        validates: [notEmpty('Du mangler vælg kunde')],
      }),
      staff: useField({
        value: data?.staff?._id || undefined,
        validates: [notEmpty('Du mangler vælg medarbejder')],
      }),
      date: useField({
        value: data?.start ? new Date(data?.start) : undefined,
        validates: [notEmpty('Du mangler vælg dato')],
      }),
      time: useField({
        value: {
          start: data?.start || undefined,
          end: data?.end || undefined,
        },
        validates: [notEmpty('Du mangler vælg tid')],
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
            </Card>
          </Layout.AnnotatedSection>
        </Layout>
      </Form>
    </Page>
  );
};

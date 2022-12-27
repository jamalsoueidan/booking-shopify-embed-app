import {
  CustomerAutocomplete,
  ProductSelect,
  ScheduleDateSelect,
  ScheduleStaffSelect,
  ScheduleTimerSelect,
} from '@components/bookings/BookingForm';
import { useExtendForm, useTranslation } from '@hooks';
import { notEmptyObject } from '@libs/validators/notEmptyObject';
import { useBookingCreate } from '@services/booking';
import { useNavigate } from '@shopify/app-bridge-react';
import {
  Card,
  Form,
  FormLayout,
  Layout,
  Page,
  PageActions,
} from '@shopify/polaris';
import { notEmpty, useField } from '@shopify/react-form';

export default () => {
  const navigate = useNavigate();
  const { create } = useBookingCreate();
  const { t } = useTranslation('bookings', { keyPrefix: 'new' });
  //https://codesandbox.io/s/1wpxz?file=/src/MyForm.tsx:2457-2473
  const { fields, submit, primaryAction } = useExtendForm({
    fields: {
      productId: useField<number>({
        value: undefined,
        validates: [notEmpty('Der er ikke valgt produkt')],
      }),
      customer: useField<{ customerId: number; fullName: string }>({
        value: {
          customerId: undefined,
          fullName: undefined,
        },
        validates: [notEmptyObject('Du mangler vælg kunde')],
      }),
      staff: useField<string>({
        value: undefined,
        validates: [notEmpty('Du mangler vælg medarbejder')],
      }),
      date: useField<Date>({
        value: undefined,
        validates: [notEmpty('Du mangler vælg dato')],
      }),
      time: useField<{ start: string; end: string }>({
        value: {
          start: undefined,
          end: undefined,
        },
        validates: [notEmptyObject('Du mangler vælg tid')],
      }),
    },
    onSubmit: async (fieldValues) => {
      create({
        productId: fieldValues.productId,
        customerId: fieldValues.customer.customerId,
        staff: fieldValues.staff,
        start: fieldValues.time.start,
        end: fieldValues.time.end,
      });
      navigate(`/bookings`);
      return { status: 'success' };
    },
  });

  return (
    <Form onSubmit={submit}>
      <Page
        fullWidth
        title={t('title')}
        breadcrumbs={[{ content: 'Bookings', url: '/Bookings' }]}>
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
              <CustomerAutocomplete {...fields.customer}></CustomerAutocomplete>
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
        <br />
        <PageActions primaryAction={primaryAction} />
      </Page>
    </Form>
  );
};

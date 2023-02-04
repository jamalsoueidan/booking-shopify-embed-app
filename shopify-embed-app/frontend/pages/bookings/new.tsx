import {
  CustomerAutocomplete,
  ProductSelect,
  ScheduleDateSelect,
  ScheduleStaffSelect,
  ScheduleTimerSelect,
} from "@components/bookings/bookingForm";
import { useTranslation } from "@hooks";
import { useForm, useToast } from "@jamalsoueidan/bsf.bsf-pkg";
import { notEmptyObject } from "@libs/validators/notEmptyObject";
import { useBookingCreate } from "@services/booking";
import { useNavigate } from "@shopify/app-bridge-react";
import {
  Card,
  Form,
  FormLayout,
  Layout,
  Page,
  PageActions,
} from "@shopify/polaris";
import { notEmpty, useField } from "@shopify/react-form";

export default () => {
  const navigate = useNavigate();
  const { create } = useBookingCreate();
  const { show } = useToast();
  const { t } = useTranslation("bookings", { keyPrefix: "new" });
  //https://codesandbox.io/s/1wpxz?file=/src/MyForm.tsx:2457-2473
  const { fields, submit, primaryAction } = useForm({
    fields: {
      customer: useField<{ customerId: number; fullName: string }>({
        validates: [notEmptyObject("Du mangler vælg kunde")],
        value: {
          customerId: undefined,
          fullName: undefined,
        },
      }),
      date: useField<Date>({
        validates: [notEmpty("Du mangler vælg dato")],
        value: undefined,
      }),
      productId: useField<number>({
        validates: [notEmpty("Der er ikke valgt produkt")],
        value: undefined,
      }),
      staff: useField<string>({
        validates: [notEmpty("Du mangler vælg medarbejder")],
        value: undefined,
      }),
      time: useField<{ start: string; end: string }>({
        validates: [notEmptyObject("Du mangler vælg tid")],
        value: {
          end: undefined,
          start: undefined,
        },
      }),
    },
    onSubmit: async (fieldValues) => {
      await create({
        customerId: fieldValues.customer.customerId,
        end: fieldValues.time.end,
        productId: fieldValues.productId,
        staff: fieldValues.staff,
        start: fieldValues.time.start,
      });
      show({ content: "Booking created" });
      navigate(`/bookings`);
      return { status: "success" };
    },
  });

  return (
    <Form onSubmit={submit}>
      <Page
        fullWidth
        title={t("title")}
        breadcrumbs={[{ content: "Bookings", url: "/Bookings" }]}>
        <Layout>
          <Layout.AnnotatedSection title={"Produkt"}>
            <Card sectioned>
              <FormLayout>
                <ProductSelect {...fields.productId} />
              </FormLayout>
            </Card>
          </Layout.AnnotatedSection>
          <Layout.AnnotatedSection title={"Kunde"}>
            <Card sectioned>
              <CustomerAutocomplete {...fields.customer} />
            </Card>
          </Layout.AnnotatedSection>
          <Layout.AnnotatedSection
            title={"Tidsbestilling"}
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

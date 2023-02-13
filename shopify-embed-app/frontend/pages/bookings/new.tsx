import { CustomerInputAutoComplete } from "@components/booking/booking-form/CustomerInputAutoComplete";
import { ProductSelect } from "@components/booking/booking-form/ProductSelect";
import {
  InputDateDrop,
  InputStaff,
  InputStaffField,
  InputTimerDivider,
  InputTimerDividerField,
  Validators,
  useForm,
  useToast,
  useTranslation,
} from "@jamalsoueidan/pkg.bsf";
import { useBookingCreate } from "@services/booking";
import { useWidgetAvailability, useWidgetStaff } from "@services/widget";
import { useNavigate } from "@shopify/app-bridge-react";
import {
  Card,
  Form,
  FormLayout,
  Layout,
  Page,
  PageActions,
  Range,
} from "@shopify/polaris";
import { notEmpty, useField } from "@shopify/react-form";
import { endOfMonth, isSameDay } from "date-fns";
import { useMemo, useState } from "react";

export default () => {
  const navigate = useNavigate();
  const { create } = useBookingCreate();
  const { show } = useToast();
  const { t } = useTranslation({ id: "booking-new", locales });
  const [{ start, end }, dateChange] = useState<Range>({
    end: endOfMonth(new Date()),
    start: new Date(),
  });

  //https://codesandbox.io/s/1wpxz?file=/src/MyForm.tsx:2457-2473
  const { fields, submit, primaryAction } = useForm({
    fields: {
      customer: useField<{ customerId: number; fullName: string }>({
        validates: [Validators.notEmptyObject(t("customer.error_select"))],
        value: {
          customerId: undefined,
          fullName: undefined,
        },
      }),
      date: useField<Date>({
        validates: [notEmpty(t("date.error_select"))],
        value: undefined,
      }),
      productId: useField<number>({
        validates: [notEmpty(t("product.error_empty"))],
        value: undefined,
      }),
      staff: useField<InputStaffField>({
        validates: [notEmpty(t("staff.error_select"))],
        value: undefined,
      }),
      time: useField<InputTimerDividerField>({
        validates: [Validators.notEmptyObject(t("time.error_select"))],
        value: undefined,
      }),
    },
    onSubmit: async (fieldValues) => {
      await create({
        customerId: fieldValues.customer.customerId,
        productId: fieldValues.productId,
        staff: fieldValues.staff.staff,
        ...fieldValues.time,
      });
      show({ content: t("submit.sucess") });
      navigate(`/bookings`);
      return { status: "success" };
    },
  });

  const { data: staffOptions } = useWidgetStaff({
    productId: fields.productId.value,
  });

  const { data: schedules } = useWidgetAvailability({
    end,
    productId: fields.productId.value,
    staff: fields.staff.value?.staff,
    start,
  });

  const selectedDate = useMemo(() => {
    if (!fields.date.value) {
      return;
    }

    return schedules?.find((s) =>
      isSameDay(new Date(s.date), new Date(fields.date.value)),
    );
  }, [schedules, fields.date.value]);

  return (
    <Form onSubmit={submit}>
      <Page
        fullWidth
        title={t("title")}
        breadcrumbs={[{ content: "Bookings", url: "/bookings" }]}>
        <Layout>
          <Layout.AnnotatedSection
            title={t("product.title")}
            description={t("product.desc")}>
            <Card sectioned>
              <FormLayout>
                <ProductSelect {...fields.productId} />
              </FormLayout>
            </Card>
          </Layout.AnnotatedSection>
          <Layout.AnnotatedSection
            title={t("customer.title")}
            description={t("customer.desc")}>
            <Card sectioned>
              <CustomerInputAutoComplete field={fields.customer} />
            </Card>
          </Layout.AnnotatedSection>
          <Layout.AnnotatedSection
            title={t("staff.title")}
            description={t("staff.desc")}>
            <Card sectioned>
              <FormLayout>
                <InputStaff
                  field={fields.staff}
                  data={staffOptions}
                  input={{ disabled: !staffOptions }}
                />
                <InputDateDrop
                  field={fields.date}
                  data={schedules}
                  input={{ disabled: !schedules }}
                  disableDates
                  onMonthChange={dateChange}
                />
                <InputTimerDivider
                  field={fields.time}
                  data={selectedDate?.hours}
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

const locales = {
  da: {
    customer: {
      desc: "Hvem er behandlingen til?",
      error_select: "Du mangler vælg kunde",
      title: "2. Vælg en kunde",
    },
    date: {
      error_select: "Du mangler vælg dato",
    },
    product: {
      desc: "Efter  du har valgt et produkt, har du mulighed for at vælg medarbejder.",
      error_empty: "Der er ikke valgt produkt",
      title: "1. Vælg et product",
    },
    staff: {
      desc: "Når du har valgt medarbejder kan du vælge dato og efterfølgende tid.",
      error_select: "Du mangler vælg medarbejder",
      title: "3. Vælg medarbejder, dato og tid.",
    },
    submit: {
      sucess: "Behandlingstid oprettet",
    },
    time: {
      error_select: "Du mangler vælg tid",
    },
    title: "Opret en ny behandlingstid",
  },
  en: {
    customer: {
      desc: "Assign customer to booking.",
      error_select: "You didn't pick a customer",
      title: "2. Choose a Customer",
    },
    date: {
      error_select: "You didn't pick a date",
    },
    product: {
      desc: "Choose a product so staff, date and time gets enabled.",
      error_empty: "You didn't pick a product",
      title: "1. Choose a Product",
    },
    staff: {
      desc: "When you select staff the date will be enabled and then pick date to get time",
      error_select: "You didn't pick a staff",
      title: "3. Choose staff, then date and afterwards time.",
    },
    submit: {
      sucess: "Booking created",
    },
    time: {
      error_select: "You didn't pick time",
    },
    title: "Bookings",
  },
};

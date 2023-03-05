import {
  Columns,
  Form,
  FormLayout,
  Modal,
  Range,
  Text,
} from "@shopify/polaris";
import { notEmpty, useField } from "@shopify/react-form";

import {
  Booking,
  Tag,
  WidgetHourRange,
} from "@jamalsoueidan/pkg.backend-types";
import {
  FormErrors,
  InputDateFlat,
  InputTimerDivider,
  InputTimerDividerField,
  LoadingSpinner,
  WidgetInputStaff,
  WidgetInputStaffField,
  useBookingUpdate,
  useForm,
  useModal,
  useToast,
  useTranslation,
  useWidgetAvailability,
  useWidgetStaff,
} from "@jamalsoueidan/pkg.frontend";
import { endOfMonth, isSameDay, startOfMonth } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export const BookingDetailsEdit = ({ booking }: { booking: Booking }) => {
  const { data: staffOptions } = useWidgetStaff({
    productId: booking.productId,
  });

  const [{ start, end }, dateChange] = useState<Range>({
    end: endOfMonth(new Date(booking.end)),
    start: startOfMonth(new Date(booking.start)),
  });

  const navigate = useNavigate();
  const { update } = useBookingUpdate({ id: booking._id });
  const { t } = useTranslation({ id: "bookings-edit", locales });
  const { show } = useToast();
  const { setPrimaryAction, setSecondaryActions } = useModal();

  const { fields, submit, submitErrors, isSubmitted, isValid } = useForm({
    enableSaveBar: false,
    fields: {
      date: useField<Date>({
        validates: [notEmpty(t("date.error_select"))],
        value: new Date(booking.start) || undefined,
      }),
      staff: useField<WidgetInputStaffField>({
        validates: [notEmpty(t("staff.error_select"))],
        value: booking.staff
          ? {
              avatar: booking.staff.avatar,
              fullname: booking.staff.fullname,
              staff: booking.staff._id,
              tag: Tag.all_day,
            }
          : undefined,
      }),
      time: useField<InputTimerDividerField>({
        validates: [notEmpty(t("time.error_select"))],
        value: {
          end: new Date(booking.end),
          start: new Date(booking.start),
        },
      }),
    },
    onSubmit: async (fieldValues) => {
      update({
        end: fieldValues.time.end,
        staff: fieldValues.staff.staff,
        start: fieldValues.time.start,
      });
      navigate("../");
      show({ content: t("submit.sucess") });
      return { status: "success" };
    },
  });

  useEffect(() => {
    setPrimaryAction({
      content: t("submit.primary_button"),
      onAction: submit,
    });
    setSecondaryActions([
      {
        content: t("submit.secondary_button"),
        onAction: () => {
          navigate("../");
        },
      },
    ]);

    return () => {
      setSecondaryActions([]);
      setPrimaryAction(undefined);
    };
  }, [setPrimaryAction, setSecondaryActions, navigate, t, submit]);

  const { data: schedules } = useWidgetAvailability({
    end,
    productId: booking.productId,
    staff: fields.staff.value?.staff,
    start,
  });

  const hours: WidgetHourRange[] = useMemo(() => {
    if (!fields) {
      return [];
    }

    const bookingDefault = {
      end: booking.end,
      start: booking.start,
    };

    const schedule = schedules?.find((s) =>
      isSameDay(new Date(s.date), fields.date.value),
    );

    if (!schedule) {
      return [];
    }

    return [bookingDefault, ...schedule.hours];
  }, [schedules, fields, booking.end, booking.start]);

  if (!staffOptions) {
    return (
      <Modal.Section>
        <LoadingSpinner />
      </Modal.Section>
    );
  }

  if (staffOptions.length === 0) {
    return (
      <Modal.Section>
        <Text variant="bodyMd" as="p">
          {t("staff.error_empty")}
        </Text>
      </Modal.Section>
    );
  }

  return (
    <Form onSubmit={submit}>
      <Modal.Section>
        <FormLayout>
          {isSubmitted && !isValid && <FormErrors errors={submitErrors} />}
          <WidgetInputStaff field={fields.staff} data={staffOptions} />
          <Columns columns={{ xs: 2 }}>
            <InputDateFlat
              field={fields.date}
              data={schedules}
              onMonthChange={dateChange}
              disableDates
            />
            <InputTimerDivider field={fields.time} data={hours} />
          </Columns>
          {!booking.isSelfBooked ? (
            <Text variant="bodyMd" as="p" color="critical">
              {t("shopify")}
            </Text>
          ) : null}
        </FormLayout>
      </Modal.Section>
    </Form>
  );
};

const locales = {
  da: {
    date: {
      error_select: "Du mangler vælg dato",
    },
    shopify:
      "ATTENTION: Når du opdatere dette behandlingstid, så bliver den afkoblet fra shopify!",
    staff: {
      error_empty:
        "Der er ingen medarbejder længere tilknyttet til dette produkt, gå til produkt og tilføj medarbejder.",
      error_select: "Du mangler vælg medarbejder",
    },
    submit: {
      primary_button: "Ændre dato/tid",
      secondary_button: "Anulllere",
      sucess: "Behandlingstid opdateret",
    },
    time: {
      error_select: "Du mangler vælg tid",
    },
    title: "Opret en ",
  },
  en: {
    date: {
      error_select: "You didn't pick a date",
    },
    shopify:
      "ATTENTION: When you update this booking it will get deattached from shopify order.",
    staff: {
      error_empty: "No staff belong to this product yet!",
      error_select: "You didn't pick a staff",
    },
    submit: {
      primary_button: "Change time",
      secondary_button: "Cancel",
      sucess: "Booking updated",
    },
    time: {
      error_select: "You didn't pick time",
    },
    title: "Bookings",
  },
};

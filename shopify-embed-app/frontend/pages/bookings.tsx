import { Booking } from "@jamalsoueidan/bsb.types";
import { LoadingSpinner, useTranslation } from "@jamalsoueidan/pkg.bsf";
import { useBookings, useStaff } from "@services";
import { useNavigate } from "@shopify/app-bridge-react";
import { Card, FooterHelp, Page } from "@shopify/polaris";
import { Suspense, lazy, useCallback, useState } from "react";
import { Outlet } from "react-router-dom";

const locales = {
  da: {
    create: "Opret en ny behandlingstid",
    footer_help:
      "Kan ikke ændre i bookinger der er refunderet eller oprettet tidligere end dagens dato.",
    in_progress: "I process",
    title: "Behandlinger",
  },
  en: {
    create: "Create new booking",
    footer_help:
      "You can't edit bookings that are refunded or created before today.",
    in_progress: "In progress",
    title: "Bookings",
  },
};

const BookingCalendar = lazy(() =>
  import("@jamalsoueidan/pkg.bsf").then((module) => ({
    default: module.BookingCalendar,
  })),
);

export default () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<{ start: Date; end: Date }>();

  const { t } = useTranslation({ id: "bookings", locales });

  const { data: staffier } = useStaff();
  const { data: bookings } = useBookings({
    end: date?.end,
    start: date?.start,
  });

  const onClickBooking = useCallback(
    (booking: Booking) => {
      navigate(`/bookings/${booking._id}`);
    },
    [navigate],
  );

  return (
    <Page
      fullWidth
      title={t("title")}
      primaryAction={{
        content: t("create"),
        url: "/bookings/new",
      }}>
      <Outlet />
      <Card sectioned>
        <Card.Section>
          <Suspense fallback={<LoadingSpinner />}>
            <BookingCalendar
              data={bookings}
              staff={staffier}
              onChangeDate={setDate}
              onClickBooking={onClickBooking}
            />
          </Suspense>
        </Card.Section>
      </Card>
      <FooterHelp>{t("footer_help")}</FooterHelp>
    </Page>
  );
};

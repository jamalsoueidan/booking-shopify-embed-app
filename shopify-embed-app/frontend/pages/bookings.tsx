import { BookingRequest, Staff } from "@jamalsoueidan/bsb.mongodb.types";
import {
  BookingCalendarEvent,
  LoadingModal,
  LoadingSpinner,
  useFulfillment,
  useTranslation,
} from "@jamalsoueidan/bsf.bsf-pkg";
import { useBookings, useStaff } from "@services";
import { useNavigate } from "@shopify/app-bridge-react";
import { Badge, Card, FooterHelp, Page } from "@shopify/polaris";
import Routes from "Routes";
import { Suspense, lazy, useCallback, useMemo, useState } from "react";
import { Route } from "react-router-dom";

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

const BookingModal = lazy(() =>
  import("../components/booking/booking-modal/booking-modal").then(
    (module) => ({
      default: module.BookingModal,
    }),
  ),
);

const StaffSelection = lazy(() =>
  import("@jamalsoueidan/bsf.bsf-pkg").then((module) => ({
    default: module.BookingStaff,
  })),
);

const BookingCalendar = lazy(() =>
  import("@jamalsoueidan/bsf.bsf-pkg").then((module) => ({
    default: module.BookingCalendar,
  })),
);

export default () => {
  const navigate = useNavigate();
  const [staff, setStaff] = useState<Staff>();
  const [date, setDate] = useState<Pick<BookingRequest, "start" | "end">>();

  const { t } = useTranslation({ id: "bookings", locales });

  const { options } = useFulfillment();

  const { data: staffier } = useStaff();
  const { data: bookings, isLoading } = useBookings({
    end: date?.end,
    staff: staff?._id,
    start: date?.start,
  });

  const badges = useMemo(
    () =>
      options.map((o, _) => (
        <Badge key={_} status={o.bannerStatus as any} progress="complete">
          {o.label
            ? o.label.charAt(0).toUpperCase() + o.label.slice(1)
            : t("in_progress")}
        </Badge>
      )),
    [options, t],
  );

  const onClickBooking = useCallback(
    (state: BookingCalendarEvent) => {
      console.log("navigate");
      navigate(`bookings/${state.booking._id}`);
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
      <Routes>
        <Route
          path="/:id/*"
          element={
            <Suspense fallback={<LoadingModal />}>
              <BookingModal />
            </Suspense>
          }
        />
      </Routes>
      <Card sectioned>
        <Card.Section title={badges}>
          <Suspense fallback={<LoadingSpinner />}>
            <StaffSelection
              isLoadingBookings={isLoading}
              data={staffier}
              selected={staff}
              onSelect={setStaff}
            />
          </Suspense>
        </Card.Section>
        <Card.Section>
          <Suspense fallback={<LoadingSpinner />}>
            <BookingCalendar
              data={bookings}
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

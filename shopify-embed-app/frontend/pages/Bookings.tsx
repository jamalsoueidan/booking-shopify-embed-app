import StaffSelection from "@components/bookings/staff-selection";
import { DatesSetArg, EventClickArg } from "@fullcalendar/core";
import FullCalendar from "@fullcalendar/react";
import { useDate, useFulfillment, useTranslation } from "@hooks";
import { LoadingModal, LoadingSpinner } from "@jamalsoueidan/bsf.bsf-pkg";
import { useBookings } from "@services";
import { useNavigate } from "@shopify/app-bridge-react";
import {
  Avatar,
  Badge,
  Card,
  FooterHelp,
  Page,
  Tooltip,
} from "@shopify/polaris";
import { padTo2Digits } from "helpers/pad2Digits";
import { Suspense, lazy, useCallback, useMemo, useRef, useState } from "react";

const Calendar = lazy(() => import("../components/Calendar"));
const BookingModal = lazy(() => import("../components/bookings/BookingModal"));

export default () => {
  const navigate = useNavigate();
  const [info, setInfo] = useState(null);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [staff, setStaff] = useState(null);

  const ref = useRef<FullCalendar>();
  const { t } = useTranslation("bookings");
  const { getColor, options } = useFulfillment();
  const { toTimeZone } = useDate();

  const { data: bookings, isLoading } = useBookings({ end, staff, start });

  const dateChanged = useCallback(
    (props: DatesSetArg) => {
      if (props.start !== start || props.end !== end) {
        setStart(props.start.toISOString().slice(0, 10));
        setEnd(props.end.toISOString().slice(0, 10));
      }
    },
    [end, start],
  );

  const events = useMemo(
    () =>
      bookings?.map((d) => ({
        ...d,
        backgroundColor: getColor(d.fulfillmentStatus),
        color: getColor(d.fulfillmentStatus),
        end: toTimeZone(new Date(d.end)),
        start: toTimeZone(new Date(d.start)),
        textColor: "#202223",
      })) || [],
    [bookings, getColor, toTimeZone],
  );

  const eventContent = useCallback((arg: any) => {
    const booking: BookingAggreate = arg.event.extendedProps;
    const extendHour = (
      <i>
        {padTo2Digits(arg.event.start.getHours()) +
          ":" +
          padTo2Digits(arg.event.start.getMinutes())}{" "}
        -
        {padTo2Digits(arg.event.end.getHours()) +
          ":" +
          padTo2Digits(arg.event.end.getMinutes())}
      </i>
    );

    const fulfillmentStatus = booking.fulfillmentStatus || "In progress";

    return (
      <Tooltip content={fulfillmentStatus} dismissOnMouseOut>
        <div
          style={{ cursor: "pointer", padding: "4px", position: "relative" }}>
          <div>{extendHour}</div>
          <div
            style={{
              alignItems: "center",
              bottom: 0,
              display: "flex",
              justifyContent: "flex-end",
              left: 0,
              position: "absolute",
              right: "4px",
              top: 0,
            }}>
            <Avatar
              size="small"
              name={booking.staff?.fullname}
              shape="square"
              source={booking.staff?.avatar}
            />
          </div>
          <div
            style={{
              overflow: "hidden",
            }}>
            {arg.event.title}
          </div>
        </div>
      </Tooltip>
    );
  }, []);

  const showBooking = useCallback(({ event }: EventClickArg) => {
    setInfo({
      ...event._def.extendedProps,
      end: event.endStr,
      start: event.startStr,
      title: event.title,
    });
  }, []);

  const badges = useMemo(
    () =>
      options.map((o) => (
        <Badge key={o.label} status={o.status} progress="complete">
          {o.label
            ? o.label.charAt(0).toUpperCase() + o.label.slice(1)
            : "In progress"}
        </Badge>
      )),
    [options],
  );

  return (
    <Page
      fullWidth
      title={t("title")}
      primaryAction={{
        content: "Opret en bestilling",
        onAction: () => navigate("/Bookings/New"),
      }}>
      {info ? (
        <Suspense fallback={<LoadingModal />}>
          <BookingModal show={true} toggle={setInfo} info={info} />
        </Suspense>
      ) : null}
      <Card sectioned>
        <Card.Section title={badges}>
          <br />
          <StaffSelection
            isLoading={isLoading}
            staff={staff}
            onSelect={setStaff}
          />
        </Card.Section>
        <Card.Section>
          <Suspense fallback={<LoadingSpinner />}>
            <Calendar
              ref={ref}
              events={events}
              eventContent={eventContent}
              datesSet={dateChanged}
              eventClick={showBooking}
            />
          </Suspense>
        </Card.Section>
      </Card>
      <FooterHelp>
        Kan ikke ændre i bookinger der er refunderet eller oprettet tidligere
        end dagens dato.
      </FooterHelp>
    </Page>
  );
};

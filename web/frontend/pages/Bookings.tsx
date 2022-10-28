import "@fullcalendar/react/dist/vdom";
import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import { Card, Page } from "@shopify/polaris";
import { createRef, useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import { useAuthenticatedFetch } from "../hooks";
import TimezoneSelect from "react-timezone-select";
import { format, utcToZonedTime } from "date-fns-tz";

export default () => {
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [timeZone, setTimeZone] = useState({
    value: "Europe/Brussels",
    label: "(GMT+2:00) Brussels, Copenhagen, Madrid, Paris",
  });
  const calendarRef = createRef<FullCalendar>();

  const fetch = useAuthenticatedFetch();
  const { data } = useSWR<BookingsApi>(
    start && end ? `/api/admin/bookings?start=${start}&end=${end}` : null,
    (apiURL: string) => fetch(apiURL).then((res) => res.json())
  );

  const eventDidMount = useCallback((props) => {
    if (props.start !== start || props.end !== end) {
      setStart(format(new Date(props.start), "yyyy-MM-dd"));
      setEnd(format(new Date(props.end), "yyyy-MM-dd"));
    }
  }, []);

  useEffect(() => {
    if (calendarRef) {
      let calendarApi = calendarRef.current.getApi();
      eventDidMount({
        start: calendarApi.view.activeStart,
        end: calendarApi.view.activeEnd,
      });
    }
  }, [calendarRef]);

  useEffect(() => {
    if (data) {
      const api = calendarRef.current.getApi();
      const removeEvents = api.getEvents();
      removeEvents.forEach((event) => {
        event.remove();
      });

      console.log("restart");
      const toTimeZone = (fromUTC) => utcToZonedTime(fromUTC, timeZone.value);
      data.payload.forEach((d) => {
        api.addEvent({
          ...d,
          start: toTimeZone(new Date(d.start)),
          end: toTimeZone(new Date(d.end)),
        });
      });

      console.log(api.getEvents());
    }
  }, [timeZone, data, calendarRef]);

  const eventContent = (arg) => {
    const booking: Booking = arg.event.extendedProps;
    return (
      <>
        <div>
          <i>{format(arg.event.start, "HH:mm")}</i>
        </div>
        <div>{booking.staff.fullname}</div>
        <div>
          <b>{booking.product.title}</b>
        </div>
      </>
    );
  };

  return (
    <Page fullWidth title="Bookinger">
      <Card sectioned>
        <Card.Section>
          <TimezoneSelect value={timeZone} onChange={setTimeZone} />
        </Card.Section>
        <Card.Section>
          <FullCalendar
            height="auto"
            ref={calendarRef}
            plugins={[timeGridPlugin, dayGridPlugin, listPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: "today prev,next",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
            }}
            firstDay={1}
            locale="da"
            dayMaxEvents={true}
            eventContent={eventContent}
            buttonText={{
              prev: "<<",
              next: ">>",
              today: "I dag",
              dayGridMonth: "Måned",
              timeGridWeek: "Uge",
              timeGridDay: "Dag",
              list: "Liste",
            }}
          />
        </Card.Section>
      </Card>
    </Page>
  );
};

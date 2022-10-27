import "@fullcalendar/react/dist/vdom";
import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import timeGridPlugin from "@fullcalendar/timegrid";
import { Card, Page } from "@shopify/polaris";
import useSWR from "swr";
import { useAuthenticatedFetch } from "../hooks";

export default () => {
  const fetch = useAuthenticatedFetch();
  const { data: bookings } = useSWR<BookingsApi>(
    "/api/admin/bookings",
    (apiURL: string) => fetch(apiURL).then((res) => res.json())
  );

  return (
    <Page fullWidth title="Bookinger">
      <Card sectioned>
        <FullCalendar
          plugins={[timeGridPlugin, dayGridPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={bookings?.payload}
          slotMinTime="05:00:00"
          slotMaxTime="22:00:00"
          firstDay={1}
          locale="da"
          timeZone="UTC"
        />
      </Card>
    </Page>
  );
};

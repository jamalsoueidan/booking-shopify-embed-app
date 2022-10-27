import "@fullcalendar/react/dist/vdom";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Page } from "@shopify/polaris";

export default () => {
  return (
    <Page>
      <FullCalendar
        plugins={[timeGridPlugin, dayGridPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={[
          { title: "event 1", date: "2022-10-20T12:30:00Z" },
          {
            title: "event 2",
            start: "2022-10-20T09:30:00Z",
            end: "2022-10-20T10:30:00Z",
          },
        ]}
        slotMinTime="06:00:00"
        slotMaxTime="21:00:00"
        firstDay={1}
        locale="da"
        timeZone="UTC"
      />
    </Page>
  );
};

import FullCalendar from '@fullcalendar/react'; // must go before plugins
import { Card, Page } from '@shopify/polaris';
import { format, utcToZonedTime } from 'date-fns-tz';
import { createRef, useCallback, useEffect, useState } from 'react';
import Fullcalendar from '../components/bookings/fullcalendar';
import { useBookings } from '../services/bookings';
import { useSetting } from '../services/setting';

export default () => {
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const { timeZone } = useSetting();
  const calendarRef = createRef<FullCalendar>();

  const bookings = useBookings({ start, end });

  const eventDidMount = useCallback((props: { start: Date; end: Date }) => {
    if (props.start !== start || props.end !== end) {
      setStart(format(props.start, 'yyyy-MM-dd'));
      setEnd(format(props.end, 'yyyy-MM-dd'));
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
    if (bookings) {
      const api = calendarRef.current.getApi();
      const removeEvents = api.getEvents();
      removeEvents.forEach((event) => {
        event.remove();
      });

      const toTimeZone = (fromUTC: Date) => utcToZonedTime(fromUTC, timeZone);
      bookings.forEach((d) => {
        api.addEvent({
          ...d,
          start: toTimeZone(new Date(d.start)),
          end: toTimeZone(new Date(d.end)),
        });
      });
    }
  }, [timeZone, bookings, calendarRef]);

  const eventContent = (arg: any) => {
    const booking: Booking = arg.event.extendedProps;
    return (
      <>
        <div>
          <i>{format(arg.event.start, 'HH:mm')}</i>
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
          <Fullcalendar ref={calendarRef} eventContent={eventContent} />
        </Card.Section>
      </Card>
    </Page>
  );
};

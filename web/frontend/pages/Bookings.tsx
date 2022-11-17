import FullCalendar from '@fullcalendar/react'; // must go before plugins
import { Card, Page } from '@shopify/polaris';
import { format, utcToZonedTime } from 'date-fns-tz';
import { createRef, useCallback, useEffect, useState } from 'react';
import Fullcalendar from '@components/bookings/fullcalendar';
import { useBookings } from '@services/bookings';
import useSetting from '@services/setting';

export default () => {
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const { data: settings } = useSetting();
  const calendarRef = createRef<FullCalendar>();

  const bookings = useBookings({ start, end });

  const dateChanged = useCallback((props: { start: Date; end: Date }) => {
    setStart(format(props.start, 'yyyy-MM-dd'));
    setEnd(format(props.end, 'yyyy-MM-dd'));
  }, []);

  useEffect(() => {
    if (bookings) {
      const api = calendarRef.current.getApi();
      const removeEvents = api.getEvents();
      removeEvents.forEach((event) => {
        event.remove();
      });

      const toTimeZone = (fromUTC: Date) =>
        utcToZonedTime(fromUTC, settings.timeZone);
      bookings.forEach((d) => {
        api.addEvent({
          ...d,
          start: toTimeZone(new Date(d.start)),
          end: toTimeZone(new Date(d.end)),
        });
      });
    }
  }, [settings, bookings, calendarRef]);

  const eventContent = useCallback(
    (arg: any) => {
      const api = calendarRef.current.getApi();
      const isMonth = api.view.type === 'dayGridMonth';
      const booking: Booking = arg.event.extendedProps;

      const hour = <i>{format(arg.event.start, 'HH:mm')}</i>;
      const extendHour = (
        <i>
          {format(arg.event.start, 'HH:mm')} - {format(arg.event.end, 'HH:mm')}
        </i>
      );
      return (
        <>
          <span>{isMonth ? hour : extendHour}</span>
          <span
            style={{
              display: !isMonth ? 'block' : '',
              marginLeft: isMonth ? '5px' : '0px',
            }}>
            {booking.staff.fullname}
            {booking.anyStaff ? '(ET)' : ''} - {booking.product.title}
          </span>
        </>
      );
    },
    [calendarRef]
  );

  return (
    <Page fullWidth title="Bookinger">
      <Card sectioned>
        <Card.Section>
          <Fullcalendar
            ref={calendarRef}
            eventContent={eventContent}
            datesSet={dateChanged}
            slotDuration="00:15:00"
            slotLabelFormat={[
              {
                hour: 'numeric',
                minute: '2-digit',
                omitZeroMinute: false,
                meridiem: 'short',
              },
            ]}
            eventColor="#378006"
            eventBackgroundColor="#378006"
            eventDisplay="block"
          />
        </Card.Section>
      </Card>
    </Page>
  );
};

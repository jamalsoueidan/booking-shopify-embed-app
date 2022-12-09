import BookingModal from '@components/bookings/BookingModal';
import StaffSelection from '@components/bookings/staff-selection';
import Calendar from '@components/Calendar';
import FullCalendar, { DatesSetArg, EventClickArg } from '@fullcalendar/react'; // must go before plugins
import { useBookings } from '@services/bookings';
import { useSettingGet } from '@services/setting';
import { Card, Page } from '@shopify/polaris';
import { format, utcToZonedTime } from 'date-fns-tz';
import { createRef, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default () => {
  const [info, setInfo] = useState(null);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [staff, setStaff] = useState(null);

  const { t } = useTranslation('bookings');
  const { data: settings } = useSettingGet();
  const calendarRef = createRef<FullCalendar>();

  const { data: bookings, isLoading } = useBookings({ start, end, staff });

  const dateChanged = useCallback((props: DatesSetArg) => {
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
          backgroundColor: d.cancelled ? '#c9c9c9' : '#378006',
          color: d.cancelled ? '#c9c9c9' : '#378006',
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
        <div style={{ cursor: 'pointer' }}>
          <span>{isMonth ? hour : extendHour}</span>
          <span
            style={{
              display: !isMonth ? 'block' : '',
              marginLeft: isMonth ? '5px' : '0px',
            }}>
            {booking.staff?.fullname}
            {booking.anyAvailable ? '(ET)' : ''} - {booking.product.title}
          </span>
        </div>
      );
    },
    [calendarRef]
  );

  const showBooking = useCallback(({ event }: EventClickArg) => {
    setInfo({
      ...event._def.extendedProps,
      start: event.startStr,
      end: event.endStr,
    });
  }, []);

  const bookingModal = info ? (
    <BookingModal show={info !== null} toggle={setInfo} info={info} />
  ) : null;

  return (
    <Page fullWidth title={t('title')}>
      {bookingModal}
      <Card sectioned>
        <Card.Section>
          <StaffSelection
            isLoading={isLoading}
            staff={staff}
            onSelect={setStaff}></StaffSelection>
        </Card.Section>
        <Card.Section>
          <Calendar
            ref={calendarRef}
            eventContent={eventContent}
            datesSet={dateChanged}
            eventClick={showBooking}
          />
        </Card.Section>
      </Card>
    </Page>
  );
};

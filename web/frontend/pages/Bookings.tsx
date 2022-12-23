import Calendar from '@components/Calendar';
import BookingModal from '@components/bookings/BookingModal';
import StaffSelection from '@components/bookings/staff-selection';
import FullCalendar, { DatesSetArg, EventClickArg } from '@fullcalendar/react'; // must go before plugins
import { useDate, useFulfillment, useTranslation } from '@hooks';
import { useBookings, useSetting } from '@services';
import { useNavigate } from '@shopify/app-bridge-react';
import { Badge, Card, Page } from '@shopify/polaris';
import { format } from 'date-fns-tz';
import { createRef, useCallback, useEffect, useState } from 'react';

export default () => {
  const navigate = useNavigate();
  const [info, setInfo] = useState(null);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [staff, setStaff] = useState(null);

  const { t } = useTranslation('bookings');
  const { getColor, options } = useFulfillment();
  const { data: settings } = useSetting();
  const { toTimeZone } = useDate();
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

      bookings.forEach((d) => {
        api.addEvent({
          ...d,
          start: toTimeZone(new Date(d.start)),
          end: toTimeZone(new Date(d.end)),
          backgroundColor: getColor(d.fulfillmentStatus),
          color: getColor(d.fulfillmentStatus),
          textColor: '#202223',
        });
      });
    }
  }, [settings, bookings, calendarRef]);

  const eventContent = useCallback(
    (arg: any) => {
      const booking: BookingAggreate = arg.event.extendedProps;
      const extendHour = (
        <i>
          {format(arg.event.start, 'HH:mm')} - {format(arg.event.end, 'HH:mm')}{' '}
        </i>
      );
      return (
        <div style={{ cursor: 'pointer' }}>
          <div>{extendHour}</div>
          <div
            style={{
              overflow: 'hidden',
            }}>
            {booking.staff?.fullname} - {booking.anyAvailable ? '(ET)' : ''}
          </div>
          <div
            style={{
              overflow: 'hidden',
            }}>
            {booking.product.title}
          </div>
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
    <Page
      fullWidth
      title={t('title')}
      primaryAction={{
        content: 'Opret en bestilling',
        onAction: () => navigate('/Bookings/New'),
      }}>
      {bookingModal}
      <Card sectioned>
        <Card.Section
          title={
            <>
              {options.map((o) => (
                <Badge key={o.label} status={o.status} progress="complete">
                  {o.label
                    ? o.label.charAt(0).toUpperCase() + o.label.slice(1)
                    : 'In progress'}
                </Badge>
              ))}
              <br />
            </>
          }>
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

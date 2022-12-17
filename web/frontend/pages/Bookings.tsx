import BookingModal from '@components/bookings/BookingModal';
import StaffSelection from '@components/bookings/staff-selection';
import Calendar from '@components/Calendar';
import FullCalendar, { DatesSetArg, EventClickArg } from '@fullcalendar/react'; // must go before plugins
import { useDate } from '@hooks/useDate';
import useFulfillment from '@hooks/useFulfillment';
import { useBookings } from '@services/bookings';
import { useSettingGet } from '@services/setting';
import { Badge, Card, Page, Text } from '@shopify/polaris';
import { format } from 'date-fns-tz';
import { createRef, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default () => {
  const [info, setInfo] = useState(null);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [staff, setStaff] = useState(null);

  const { t } = useTranslation('bookings');
  const { getColor } = useFulfillment();
  const { data: settings } = useSettingGet();
  const { toTimeZone } = useDate();
  const { options } = useFulfillment();
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
      const api = calendarRef.current.getApi();
      const isMonth = api.view.type === 'dayGridMonth';
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
    <Page fullWidth title={t('title')}>
      {bookingModal}
      <Card sectioned>
        <Card.Section
          title={
            <>
              {options.map((o) => (
                <Badge status={o.status} progress="complete">
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

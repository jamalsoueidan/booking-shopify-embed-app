import LoadingSpinner from '@components/LoadingSpinner';
import StaffSelection from '@components/bookings/staff-selection';
import { DatesSetArg, EventClickArg } from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import { useDate, useFulfillment, useTranslation } from '@hooks';
import { useBookings } from '@services';
import { useNavigate } from '@shopify/app-bridge-react';
import {
  Avatar,
  Badge,
  Card,
  FooterHelp,
  Page,
  Tooltip,
} from '@shopify/polaris';
import { padTo2Digits } from 'helpers/pad2Digits';
import { Suspense, lazy, useCallback, useMemo, useRef, useState } from 'react';

const Calendar = lazy(() => import('../components/Calendar'));

const BookingModal = lazy(() => import('../components/bookings/BookingModal'));

export default () => {
  const navigate = useNavigate();
  const [info, setInfo] = useState(null);
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [staff, setStaff] = useState(null);

  const ref = useRef<FullCalendar>();
  const { t } = useTranslation('bookings');
  const { getColor, options } = useFulfillment();
  const { toTimeZone } = useDate();

  const { data: bookings, isLoading } = useBookings({ start, end, staff });

  const dateChanged = useCallback((props: DatesSetArg) => {
    if (props.start !== start || props.end !== end) {
      setStart(props.start.toISOString().slice(0, 10));
      setEnd(props.end.toISOString().slice(0, 10));
    }
  }, []);

  const events = useMemo(
    () =>
      bookings?.map((d) => ({
        ...d,
        start: toTimeZone(new Date(d.start)),
        end: toTimeZone(new Date(d.end)),
        backgroundColor: getColor(d.fulfillmentStatus),
        color: getColor(d.fulfillmentStatus),
        textColor: '#202223',
      })) || [],
    [bookings]
  );

  const eventContent = useCallback((arg: any) => {
    const booking: BookingAggreate = arg.event.extendedProps;
    const extendHour = (
      <i>
        {padTo2Digits(arg.event.start.getHours()) +
          ':' +
          padTo2Digits(arg.event.start.getMinutes())}{' '}
        -
        {padTo2Digits(arg.event.end.getHours()) +
          ':' +
          padTo2Digits(arg.event.end.getMinutes())}
      </i>
    );

    const fulfillmentStatus = booking.fulfillmentStatus || 'In progress';

    return (
      <Tooltip content={fulfillmentStatus} dismissOnMouseOut>
        <div
          style={{ cursor: 'pointer', padding: '4px', position: 'relative' }}>
          <div>{extendHour}</div>
          <div
            style={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: 0,
              right: '4px',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
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
              overflow: 'hidden',
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
      start: event.startStr,
      end: event.endStr,
      title: event.title,
    });
  }, []);

  const badges = useMemo(
    () =>
      options.map((o) => (
        <Badge key={o.label} status={o.status} progress="complete">
          {o.label
            ? o.label.charAt(0).toUpperCase() + o.label.slice(1)
            : 'In progress'}
        </Badge>
      )),
    [options]
  );

  return (
    <Page
      fullWidth
      title={t('title')}
      primaryAction={{
        content: 'Opret en bestilling',
        onAction: () => navigate('/Bookings/New'),
      }}>
      {info ? (
        <Suspense>
          <BookingModal show={true} toggle={setInfo} info={info} />
        </Suspense>
      ) : null}
      <Card sectioned>
        <Card.Section title={badges}>
          <br />
          <StaffSelection
            isLoading={isLoading}
            staff={staff}
            onSelect={setStaff}></StaffSelection>
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

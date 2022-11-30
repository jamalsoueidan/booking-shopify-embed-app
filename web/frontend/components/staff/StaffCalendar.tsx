import Calendar from '@components/Calendar';
import useTagOptions from '@components/useTagOptions';
import { DateClickArg } from '@fullcalendar/interaction';
import FullCalendar, {
  DatesSetArg,
  EventClickArg,
  EventContentArg,
} from '@fullcalendar/react';
import { useSettingGet } from '@services/setting';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { createRef, useCallback, useEffect } from 'react';

interface StaffCalendarProps {
  create: (info: DateClickArg) => void;
  edit: (event: EventClickArg) => void;
  onChangeDate: (props: CalendarDateChangeProps) => void;
  events: Schedule[];
}

export default ({ create, edit, events, onChangeDate }: StaffCalendarProps) => {
  const calendarRef = createRef<FullCalendar>();
  const {
    data: { timeZone },
  } = useSettingGet();
  const tagOptions = useTagOptions();

  const dateChanged = useCallback(
    (props: DatesSetArg) => {
      onChangeDate({
        start: format(props.start, 'yyyy-MM-dd'),
        end: format(props.end, 'yyyy-MM-dd'),
      });
    },
    [onChangeDate]
  );

  const toTimeZone = useCallback(
    (fromUTC: Date) => {
      return utcToZonedTime(fromUTC, timeZone);
    },
    [timeZone]
  );

  useEffect(() => {
    if (events?.length > 0 && calendarRef.current) {
      const api = calendarRef.current.getApi();
      const removeEvents = api.getEvents();
      removeEvents.forEach((event) => {
        event.remove();
      });

      events.forEach((extendedProps) => {
        api.addEvent({
          extendedProps,
          start: toTimeZone(new Date(extendedProps.start)),
          end: toTimeZone(new Date(extendedProps.end)),
          backgroundColor: extendedProps.tag,
          color: extendedProps.tag,
        });
      });
    }
  }, [events, calendarRef]);

  const eventContent = useCallback(
    (arg: EventContentArg) => {
      const schedule: Schedule = arg.event.extendedProps as Schedule;
      const hour = (
        <i>
          {format(arg.event.start, 'HH:mm')} - {format(arg.event.end, 'HH:mm')}
        </i>
      );

      return (
        <div
          style={{
            cursor: 'pointer',
            padding: '5px',
            display: 'flex',
            flexDirection: 'column',
          }}>
          <div>{hour}</div>
          <div>{tagOptions.find((v) => v.value === schedule.tag).label} </div>
          {schedule.groupId && (
            <div
              style={{
                marginTop: '4px',
                width: '15px',
                height: '15px',
                backgroundColor: '#' + schedule.groupId.slice(-6),
              }}></div>
          )}
        </div>
      );
    },
    [calendarRef]
  );

  return (
    <Calendar
      ref={calendarRef}
      eventContent={eventContent}
      datesSet={dateChanged}
      headerToolbar={{
        left: 'today prev,next',
        center: 'title',
        right: 'dayGridMonth',
      }}
      dateClick={create}
      eventClick={edit}
      validRange={(nowDate) => {
        return { start: nowDate };
      }}
    />
  );
};

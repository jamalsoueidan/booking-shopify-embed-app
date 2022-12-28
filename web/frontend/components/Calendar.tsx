import FullCalendar, { CalendarOptions } from '@fullcalendar/react'; // must go before plugins
import '@fullcalendar/react/dist/vdom';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useSettings } from '@providers/settings';
import { forwardRef } from 'react';

export const Calendar = forwardRef(
  (props: CalendarOptions, ref: { current: FullCalendar }) => {
    const { language } = useSettings();

    return (
      <FullCalendar
        height="auto"
        ref={ref}
        plugins={[timeGridPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'today prev,next',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
        }}
        firstDay={1}
        dayMaxEvents={true}
        slotDuration="00:15:00"
        slotLabelFormat={[
          {
            hour: 'numeric',
            minute: '2-digit',
            omitZeroMinute: false,
            meridiem: 'short',
          },
        ]}
        eventDisplay="block"
        slotMinTime="07:00"
        slotMaxTime="20:00"
        locale={language}
        buttonText={{
          prev: '<<',
          next: '>>',
        }}
        {...props}
      />
    );
  }
);

import '@fullcalendar/react/dist/vdom';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import FullCalendar, { CalendarOptions } from '@fullcalendar/react'; // must go before plugins
import timeGridPlugin from '@fullcalendar/timegrid';
import { forwardRef, useEffect } from 'react';

export default forwardRef((props: CalendarOptions, ref: any) => {
  useEffect(() => {
    //console.log(ref)
  }, [ref]);

  return (
    <FullCalendar
      height="auto"
      ref={ref}
      plugins={[timeGridPlugin, dayGridPlugin, listPlugin]}
      initialView="timeGridWeek"
      headerToolbar={{
        left: 'today prev,next',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek',
      }}
      firstDay={1}
      locale="da"
      dayMaxEvents={true}
      slotMinTime="07:00"
      slotMaxTime="20:00"
      buttonText={{
        prev: '<<',
        next: '>>',
        today: 'I dag',
        dayGridMonth: 'Måned',
        timeGridWeek: 'Uge',
        timeGridDay: 'Dag',
        list: 'Liste',
      }}
      {...props}
    />
  );
});

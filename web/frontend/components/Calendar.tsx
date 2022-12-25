import { CalendarOptions } from '@fullcalendar/core';
import da from '@fullcalendar/core/locales/da';
import en from '@fullcalendar/core/locales/en-gb';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import FullCalendar from '@fullcalendar/react'; // must go before plugins
import timeGridPlugin from '@fullcalendar/timegrid';
import { useSetting } from '@services';
import { forwardRef, useEffect } from 'react';

export default forwardRef(
  (props: CalendarOptions, ref: { current: FullCalendar }) => {
    const { data: settings } = useSetting();

    useEffect(() => {
      console.log(ref.current.props);
    }, [ref.current, settings.language]);

    return (
      <FullCalendar
        height="auto"
        ref={ref}
        plugins={[timeGridPlugin, dayGridPlugin, listPlugin, interactionPlugin]}
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
        locales={[en, da]}
        locale={settings.language}
        buttonText={{
          prev: '<<',
          next: '>>',
        }}
        {...props}
      />
    );
  }
);

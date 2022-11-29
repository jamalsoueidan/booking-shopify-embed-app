import '@fullcalendar/react/dist/vdom';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import FullCalendar, { CalendarOptions } from '@fullcalendar/react'; // must go before plugins
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { useSettingGet } from '@services/setting';
import { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';

export default forwardRef((props: CalendarOptions, ref: any) => {
  const { t } = useTranslation('common', { keyPrefix: 'calendar' });
  const { data: settings } = useSettingGet();

  return (
    <FullCalendar
      height="auto"
      ref={ref}
      plugins={[timeGridPlugin, dayGridPlugin, listPlugin, interactionPlugin]}
      initialView="timeGridWeek"
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
      locale={settings.language}
      buttonText={{
        prev: '<<',
        next: '>>',
        today: t('today'),
        dayGridMonth: t('day_grid_month'),
        timeGridWeek: t('time_grid_week'),
        timeGridDay: t('time_grid_day'),
        list: t('list'),
      }}
      validRange={(nowDate) => {
        return { start: nowDate };
      }}
      {...props}
    />
  );
});

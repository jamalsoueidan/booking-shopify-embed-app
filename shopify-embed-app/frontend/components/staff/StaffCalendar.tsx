import {
  DatesSetArg,
  EventClickArg,
  EventContentArg,
} from "@fullcalendar/core";
import { DateClickArg } from "@fullcalendar/interaction";
import { Schedule } from "@jamalsoueidan/bsb.mongodb.types";
import { Calendar, useDate, useTag } from "@jamalsoueidan/bsf.bsf-pkg";
import { format } from "date-fns";
import { useCallback, useMemo, useState } from "react";

interface StaffCalendarProps {
  create: (info: DateClickArg) => void;
  edit: (event: EventClickArg) => void;
  onChangeDate?: (props: CalendarDateChangeProps) => void;
  data: Schedule[];
}

export default ({ create, edit, data, onChangeDate }: StaffCalendarProps) => {
  const { toTimeZone } = useDate();
  const { select: selectTag } = useTag();

  const [date, setDate] = useState<CalendarDateChangeProps>();

  const dateChanged = useCallback(
    ({ start, end }: DatesSetArg) => {
      const newDate = {
        end: end.toISOString().slice(0, 10),
        start: start.toISOString().slice(0, 10),
      };

      if (newDate.start !== date?.start || newDate.end !== date?.end) {
        setDate(newDate);
        onChangeDate(newDate);
      }
    },
    [date, onChangeDate],
  );

  const events = useMemo(
    () =>
      data?.map((extendedProps) => ({
        backgroundColor: extendedProps.tag,
        color: extendedProps.tag,
        end: toTimeZone(extendedProps.end),
        extendedProps,
        start: toTimeZone(extendedProps.start),
      })) || [],
    [data, toTimeZone],
  );

  const eventContent = useCallback(
    (arg: EventContentArg) => {
      const schedule: Schedule = arg.event.extendedProps as Schedule;
      const hour = (
        <i>
          {format(arg.event.start, "HH:mm")} - {format(arg.event.end, "HH:mm")}
        </i>
      );

      return (
        <div
          style={{
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            padding: "5px",
          }}>
          <div>{hour}</div>
          <div>{selectTag(schedule.tag as never)} </div>
          {schedule.groupId && (
            <div
              style={{
                backgroundColor: "#" + schedule.groupId.slice(-6),
                height: "15px",
                marginTop: "4px",
                width: "15px",
              }}
            />
          )}
        </div>
      );
    },
    [selectTag],
  );

  const validRange = useCallback((start: Date) => ({ start }), []);

  return (
    <Calendar
      events={events}
      eventContent={eventContent}
      datesSet={dateChanged}
      headerToolbar={{
        center: "title",
        left: "today prev,next",
        right: null,
      }}
      dateClick={create}
      eventClick={edit}
      validRange={validRange}
    />
  );
};

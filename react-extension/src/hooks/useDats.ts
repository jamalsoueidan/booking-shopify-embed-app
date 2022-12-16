import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";
import { useCallback } from "react";
import { useSettings } from "./useSetting";

const useDate = () => {
  const { data } = useSettings();

  const toTimeZone = useCallback(
    (fromUTC: Date) => utcToZonedTime(fromUTC, data?.timeZone || ""),
    [data]
  );

  const toUtc = useCallback(
    (date: string | Date) => zonedTimeToUtc(date, data?.timeZone || ""),
    [data]
  );

  const toHour = useCallback(
    (date: Date | string) => {
      const timeZoneDate = toTimeZone(new Date(date));
      return `${timeZoneDate.getHours()}:${
        timeZoneDate.getMinutes() < 10 ? "0" : ""
      }${timeZoneDate.getMinutes()}`;
    },
    [toTimeZone]
  );

  return {
    toTimeZone,
    toUtc,
    toHour,
  };
};

export { useDate };

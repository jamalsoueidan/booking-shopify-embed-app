import { useSetting } from '@services';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { useCallback } from 'react';

export const useDate = () => {
  const { data } = useSetting();

  const toTimeZone = useCallback(
    (fromUTC: string | Date) => utcToZonedTime(fromUTC, data.timeZone),
    [data.timeZone]
  );

  const toUtc = useCallback(
    (date: string | Date) => zonedTimeToUtc(date, data.timeZone),
    [data.timeZone]
  );

  return {
    toTimeZone,
    toUtc,
  };
};

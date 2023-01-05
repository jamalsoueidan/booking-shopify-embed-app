import { useSettings } from '@providers/settings';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { useCallback } from 'react';

export const useDate = () => {
  const { timeZone } = useSettings();

  const toTimeZone = useCallback(
    (fromUTC: string | Date) => utcToZonedTime(fromUTC, timeZone),
    [timeZone]
  );

  const toUtc = useCallback(
    (date: string | Date) => zonedTimeToUtc(date, timeZone),
    [timeZone]
  );

  return {
    toTimeZone,
    toUtc,
  };
};

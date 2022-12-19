import { useSettingGet } from '@services/setting';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { useCallback } from 'react';

export const useDate = () => {
  const { data } = useSettingGet();

  const toTimeZone = useCallback(
    (fromUTC: Date) => utcToZonedTime(fromUTC, data.timeZone),
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

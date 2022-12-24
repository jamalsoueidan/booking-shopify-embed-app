import { useCallback, useMemo } from 'react';

export enum FulfillmentStatus {
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  FULFILLED = 'fulfilled',
  BOOKED = 'booked',
}

//attention = yellow
//critial = pink
//success = green
//default = grey

interface UseFulfillmentOptions {
  label: string;
  color: string;
  status: 'critical' | 'success' | 'attention' | 'info';
}

export const useFulfillment = () => {
  const options: UseFulfillmentOptions[] = useMemo(
    () => [
      { label: FulfillmentStatus.CANCELLED, color: '#E4E5E7', status: null },
      {
        label: FulfillmentStatus.FULFILLED,
        color: '#AEE9D1',
        status: 'success',
      },
      {
        label: FulfillmentStatus.REFUNDED,
        color: '#FED3D1',
        status: 'critical',
      },
      {
        label: FulfillmentStatus.BOOKED,
        color: '#a4e8f2',
        status: 'info',
      },
      { label: null, color: '#FFEA8A', status: 'attention' },
    ],
    []
  );

  const getColor = useCallback(
    (label: string) => {
      return options.find((o) => o.label === label)?.color;
    },
    [options]
  );

  return {
    options,
    getColor,
  };
};

import { useCallback, useMemo } from 'react';

export enum FulfillmentStatus {
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  FULFILLED = 'fulfilled',
}

//attention = yellow
//critial = pink
//success = green
//default = grey

interface UseFulfillmentOptions {
  label: string;
  color: string;
  status: 'critical' | 'success' | 'attention';
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

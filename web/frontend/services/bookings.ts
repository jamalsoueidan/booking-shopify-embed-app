import { useAuthenticatedFetch } from '@hooks/useAuthenticatedFetch';
import { useCallback } from 'react';
import useSWR, { useSWRConfig } from 'swr';

interface useBookingsProps {
  start: string;
  end: string;
  staff: string;
}

interface useBookingsReturn {
  data: Booking[];
  isLoading: boolean;
}

export const useBookings = ({
  start,
  end,
  staff,
}: useBookingsProps): useBookingsReturn => {
  const fetch = useAuthenticatedFetch();
  const { data, error } = useSWR<BookingsApi>(
    start && end
      ? `/api/admin/bookings?start=${start}&end=${end}${
          staff ? '&staff=' + staff : ''
        }`
      : null,
    (apiURL: string) => fetch(apiURL).then((r: Response) => r.json())
  );

  return {
    data: data?.payload,
    isLoading: !error && !data,
  };
};

interface UseBookingUpdateProps {
  id: string;
}

type UseBookingUpdateFunc = (body: {
  start: string;
  end: string;
  staff: string;
}) => void;
interface UseBookingUpdateReturn {
  update: UseBookingUpdateFunc;
}

export const useBookingUpdate = ({
  id,
}: UseBookingUpdateProps): UseBookingUpdateReturn => {
  const fetch = useAuthenticatedFetch();
  const { mutate } = useSWRConfig();

  const update: UseBookingUpdateFunc = useCallback(
    async (body) => {
      await fetch('/api/admin/bookings/' + id, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      });
      mutate('/api/admin/bookings/' + id);
    },
    [id]
  );

  return {
    update,
  };
};

interface UseBookingGetProps {
  id: string;
}
interface UseBookingGetReturn {
  data: Booking;
}

export const useBookingGet = ({
  id,
}: UseBookingGetProps): UseBookingGetReturn => {
  const fetch = useAuthenticatedFetch();

  const { data } = useSWR<BookingsGetApi>(
    `/api/admin/bookings/${id}`,
    (apiURL: string) => fetch(apiURL).then((r: Response) => r.json())
  );

  return {
    data: data?.payload,
  };
};

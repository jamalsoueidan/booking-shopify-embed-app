import { useAuthenticatedFetch } from '@hooks/useAuthenticatedFetch';
import { useCallback } from 'react';
import useSWR, { useSWRConfig } from 'swr';

export const useBookings = ({ start, end, staff }: BookingQuery) => {
  const fetch = useAuthenticatedFetch();
  const { data, error } = useSWR<ApiResponse<Array<BookingAggreate>>>(
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

type UseBookingUpdateFetch = (body: BookingBodyUpdate) => void;

export const useBookingUpdate = ({ id }: UseBookingUpdateProps) => {
  const fetch = useAuthenticatedFetch();
  const { mutate } = useSWRConfig();

  const update: UseBookingUpdateFetch = useCallback(
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

export const useBookingGet = ({ id }: UseBookingGetProps) => {
  const fetch = useAuthenticatedFetch();

  const { data } = useSWR<ApiResponse<BookingAggreate>>(
    `/api/admin/bookings/${id}`,
    (apiURL: string) => fetch(apiURL).then((r: Response) => r.json())
  );

  return {
    data: data?.payload,
  };
};

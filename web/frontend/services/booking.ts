import { useFetch } from '@hooks';
import { useCallback } from 'react';
import { useQuery } from 'react-query';

export const useBookings = ({ start, end, staff }: BookingQuery) => {
  const { get } = useFetch();
  const { data, isLoading } = useQuery<ApiResponse<Array<BookingAggreate>>>({
    queryKey: ['bookings', { start, end, staff }],
    queryFn: () =>
      get(
        `/api/admin/bookings?start=${start}&end=${end}${
          staff ? '&staff=' + staff : ''
        }`
      ),
    enabled: !!start && !!end,
  });

  return {
    data: data?.payload,
    isLoading,
  };
};

interface UseBookingUpdateProps {
  id: string;
}

type UseBookingUpdateFetch = (body: BookingBodyUpdate) => void;

export const useBookingUpdate = ({ id }: UseBookingUpdateProps) => {
  const { put, mutate } = useFetch();

  const update: UseBookingUpdateFetch = useCallback(
    async (body) => {
      await put('/api/admin/bookings/' + id, body);
      mutate(['booking', id]);
    },
    [put, mutate]
  );

  return {
    update,
  };
};

interface UseBookingGetProps {
  id: string;
}

export const useBookingGet = ({ id }: UseBookingGetProps) => {
  const { get } = useFetch();

  const { data } = useQuery<ApiResponse<BookingAggreate>>(['booking', id], () =>
    get(`/api/admin/bookings/${id}`)
  );

  return {
    data: data?.payload,
  };
};

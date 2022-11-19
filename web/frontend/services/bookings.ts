import useSWR from 'swr';
import { useAuthenticatedFetch } from '@hooks/useAuthenticatedFetch';

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

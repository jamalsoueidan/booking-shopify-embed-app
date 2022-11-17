import useSWR from 'swr';
import { useAuthenticatedFetch } from '@hooks/useAuthenticatedFetch';

interface useBookingsProps {
  start: string;
  end: string;
}

export const useBookings = ({ start, end }: useBookingsProps) => {
  const fetch = useAuthenticatedFetch();
  const { data } = useSWR<BookingsApi>(
    start && end ? `/api/admin/bookings?start=${start}&end=${end}` : null,
    (apiURL: string) => fetch(apiURL).then((r: Response) => r.json())
  );

  return data?.payload || [];
};

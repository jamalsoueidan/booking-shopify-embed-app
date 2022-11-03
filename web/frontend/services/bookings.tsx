import useSWR from 'swr';
import { useAuthenticatedFetch } from '../hooks';

interface useBookingsProps {
  start: string;
  end: string;
}

export const useBookings = ({ start, end }: useBookingsProps) => {
  const fetch = useAuthenticatedFetch();
  const { data } = useSWR<BookingsApi>(
    start && end ? `/api/admin/bookings?start=${start}&end=${end}` : null,
    (apiURL: string) => fetch(apiURL).then((res: Response) => res.json())
  );

  return data?.payload || [];
};

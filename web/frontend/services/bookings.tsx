import useSWR from "swr";
import { useAuthenticatedFetch } from "../hooks";

export const useBookings = ({ start, end }) => {
  const fetch = useAuthenticatedFetch();
  const { data } = useSWR<BookingsApi>(
    start && end ? `/api/admin/bookings?start=${start}&end=${end}` : null,
    (apiURL: string) => fetch(apiURL).then((res) => res.json())
  );

  return data?.payload || [];
};

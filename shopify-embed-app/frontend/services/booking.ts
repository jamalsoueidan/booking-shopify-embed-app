import { useFetch } from "@hooks/use-fetch";
import {
  ApiResponse,
  Booking,
  BookingServiceCreateProps,
  BookingServiceGetAllProps,
  BookingServiceUpdateProps,
} from "@jamalsoueidan/bsb.types";
import { useCallback } from "react";
import { useQuery } from "react-query";

export const useBookings = ({
  start,
  end,
  staff,
}: BookingServiceGetAllProps) => {
  const { get } = useFetch();
  const { data, isLoading } = useQuery<ApiResponse<Array<Booking>>>({
    enabled: !!start && !!end,
    queryFn: () =>
      get(
        `/api/admin/bookings?start=${start.toJSON()}&end=${end.toJSON()}${
          staff ? "&staff=" + staff : ""
        }`,
      ),
    queryKey: ["bookings", { end, staff, start }],
  });

  return {
    data: data?.payload,
    isLoading,
  };
};

export const useBookingUpdate = ({
  id,
}: {
  id: BookingServiceUpdateProps["query"]["_id"];
}) => {
  const { put, mutate } = useFetch();

  const update = useCallback(
    async (body: BookingServiceUpdateProps["body"]) => {
      await put("/api/admin/bookings/" + id, body);
      await mutate(["booking", id]);
    },
    [put, id, mutate],
  );

  return {
    update,
  };
};

export const useBookingCreate = () => {
  const { post, mutate } = useFetch();

  const create = useCallback(
    async (body: BookingServiceCreateProps): Promise<ApiResponse<Booking>> => {
      const response = await post("/api/admin/bookings", body);
      await mutate(["bookings"]);
      await mutate(["widget", "availability"]);
      return response;
    },
    [post, mutate],
  );

  return {
    create,
  };
};

interface UseBookingGetProps {
  id?: string;
}

export const useBookingGet = ({ id }: UseBookingGetProps) => {
  const { get } = useFetch();

  const { data } = useQuery<ApiResponse<Booking>>(
    ["booking", id],
    () => get(`/api/admin/bookings/${id}`),
    { enabled: !!id },
  );

  return {
    data: data?.payload,
  };
};

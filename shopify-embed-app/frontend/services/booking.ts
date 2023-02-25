import {
  ApiResponse,
  Booking,
  BookingServiceCreateProps,
  BookingServiceGetAllProps,
  BookingServiceUpdateProps,
} from "@jamalsoueidan/pkg.bsb-types";
import { useFetch } from "@jamalsoueidan/pkg.bsf";
import { useCallback } from "react";
import { useQuery } from "react-query";

export const useBookings = (
  params: Omit<BookingServiceGetAllProps, "staff"> & { staff?: string },
) => {
  const { get } = useFetch();
  const { data, isLoading } = useQuery<ApiResponse<Array<Booking>>>({
    enabled: !!params.start && !!params.end,
    queryFn: () =>
      get({
        params,
        url: "/bookings",
      }),
    queryKey: ["bookings", params],
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
      await put({ body, url: `/bookings/${id}` });
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
      const response = await post<never>({ body, url: "/bookings" });
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
    () => get({ url: `/bookings/${id}` }),
    { enabled: !!id },
  );

  return {
    data: data?.payload,
  };
};

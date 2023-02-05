import { useFetch } from "@hooks";
import {
  ApiResponse,
  BookingBodyCreateRequest,
  BookingBodyUpdateRequest,
  BookingRequest,
  BookingResponse,
} from "@jamalsoueidan/bsb.mongodb.types";
import { useCallback } from "react";
import { useQuery } from "react-query";

export const useBookings = ({ start, end, staff }: BookingRequest) => {
  const { get } = useFetch();
  const { data, isLoading } = useQuery<ApiResponse<Array<BookingResponse>>>({
    enabled: !!start && !!end,
    queryFn: () =>
      get(
        `/api/admin/bookings?start=${start}&end=${end}${
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

interface UseBookingUpdateProps {
  id: string;
}

type UseBookingUpdateFetch = (body: BookingBodyUpdateRequest) => void;

export const useBookingUpdate = ({ id }: UseBookingUpdateProps) => {
  const { put, mutate } = useFetch();

  const update: UseBookingUpdateFetch = useCallback(
    async (body) => {
      await put("/api/admin/bookings/" + id, body);
      await mutate(["booking", id]);
    },
    [put, id, mutate],
  );

  return {
    update,
  };
};

type UseBookingCreateFetch = (
  body: BookingBodyCreateRequest,
) => Promise<ApiResponse<BookingResponse>>;

export const useBookingCreate = () => {
  const { post, mutate } = useFetch();

  const create: UseBookingCreateFetch = useCallback(
    async (body) => {
      const response: ApiResponse<BookingResponse> = await post(
        "/api/admin/bookings",
        body,
      );
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

  const { data } = useQuery<ApiResponse<BookingResponse>>(
    ["booking", id],
    () => get(`/api/admin/bookings/${id}`),
    { enabled: !!id },
  );

  return {
    data: data?.payload,
  };
};

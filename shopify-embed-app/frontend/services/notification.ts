import { useFetch } from "@hooks/use-fetch";
import {
  ApiResponse,
  NotificationBody,
  NotificationQuery,
} from "@jamalsoueidan/bsb.types";
import { useCallback } from "react";
import { useQuery } from "react-query";

export const useNotification = ({ orderId, lineItemId }: NotificationQuery) => {
  const { get } = useFetch();

  const { data, isLoading } = useQuery<ApiResponse<Array<Notification>>>({
    enabled: !!orderId && !!lineItemId,
    queryFn: () =>
      get(
        `/api/admin/notifications?orderId=${orderId}&lineItemId=${lineItemId}`,
      ),
    queryKey: ["notification", orderId, lineItemId],
  });

  return {
    data: data?.payload || [],
    isLoading: isLoading,
  };
};

type UseSendCustomerNotificaionCreate = (
  body: NotificationBody,
) => Promise<ApiResponse<Notification>>;

export const useSendCustomNotification = ({
  orderId,
  lineItemId,
}: NotificationQuery) => {
  const { post } = useFetch();
  const send: UseSendCustomerNotificaionCreate = useCallback(
    (body) =>
      post(`/api/admin/notifications`, { ...body, lineItemId, orderId }),
    [lineItemId, orderId, post],
  );

  return {
    send,
  };
};

interface UseResendNotificationBody {
  id: string;
}

type UseResendNotificaionCreate = ({
  id,
}: UseResendNotificationBody) => Promise<ApiResponse<Notification>>;

export const useResendNotification = () => {
  const { post } = useFetch();
  const resend: UseResendNotificaionCreate = useCallback(
    ({ id }) => post(`/api/admin/notifications/${id}`),
    [post],
  );

  return {
    resend,
  };
};

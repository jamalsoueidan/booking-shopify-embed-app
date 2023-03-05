import {
  ApiResponse,
  NotificationBody,
  NotificationQuery,
} from "@jamalsoueidan/pkg.backend-types";
import { useFetch } from "@jamalsoueidan/pkg.frontend";
import { useCallback } from "react";
import { useQuery } from "react-query";

export const useNotification = (params: NotificationQuery) => {
  const { get } = useFetch();

  const { data, isLoading } = useQuery<ApiResponse<Array<Notification>>>({
    enabled: !!params.orderId && !!params.lineItemId,
    queryFn: () => get({ params, url: "/notifications" }),
    queryKey: ["notification", params],
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
      post({
        body: { ...body, lineItemId, orderId },
        url: `/notifications`,
      }),
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
    ({ id }) => post({ url: `/notifications/${id}` }),
    [post],
  );

  return {
    resend,
  };
};

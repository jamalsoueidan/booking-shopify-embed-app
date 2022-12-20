import { useFetch } from '@hooks';
import { useCallback } from 'react';
import { useQuery } from 'react-query';

export const useNotification = ({ orderId, lineItemId }: NotificationQuery) => {
  const { get } = useFetch();
  const enabled = orderId !== null && lineItemId !== null;

  const { data, isLoading } = useQuery<ApiResponse<Array<Notification>>>({
    queryKey: ['notification', orderId, lineItemId],
    queryFn: () =>
      get(
        `/api/admin/notifications?orderId=${orderId}&lineItemId=${lineItemId}`
      ),
    enabled,
  });

  return {
    data: data?.payload || [],
    isLoading: isLoading,
  };
};

type UseSendCustomerNotificaionCreate = (
  body: NotificationBody
) => Promise<ApiResponse<Notification>>;

export const useSendCustomNotification = ({
  orderId,
  lineItemId,
}: NotificationQuery) => {
  const { post } = useFetch();
  const send: UseSendCustomerNotificaionCreate = useCallback(
    (body) =>
      post(`/api/admin/notifications`, { ...body, orderId, lineItemId }),
    [post]
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
    [post]
  );

  return {
    resend,
  };
};

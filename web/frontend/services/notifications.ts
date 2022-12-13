import { useAuthenticatedFetch } from '@hooks/useAuthenticatedFetch';
import { useCallback } from 'react';
import useSWR from 'swr';

export const useNotifications = ({
  orderId,
  lineItemId,
}: NotificationQuery) => {
  const fetch = useAuthenticatedFetch();
  const { data, error } = useSWR<ApiResponse<Array<Notification>>>(
    orderId && lineItemId
      ? `/api/admin/notifications?orderId=${orderId}&lineItemId=${lineItemId}`
      : null,
    (apiURL: string) => fetch(apiURL).then((r: Response) => r.json())
  );

  return {
    data: data?.payload || [],
    isLoading: !error && !data,
  };
};

type UseSendCustomerNotificaionCreate = (
  body: NotificationBody
) => Promise<ApiResponse<Notification>>;

export const useSendCustomNotification = ({
  orderId,
  lineItemId,
}: NotificationQuery) => {
  const fetch = useAuthenticatedFetch();
  const send: UseSendCustomerNotificaionCreate = useCallback(async (body) => {
    return await fetch(`/api/admin/notifications`, {
      method: 'POST',
      body: JSON.stringify({ ...body, orderId, lineItemId }),
      headers: { 'Content-Type': 'application/json' },
    }).then((res: Response) => res.json());
  }, []);

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
  const fetch = useAuthenticatedFetch();
  const resend: UseResendNotificaionCreate = useCallback(async ({ id }) => {
    return await fetch(`/api/admin/notifications/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }).then((res: Response) => res.json());
  }, []);

  return {
    resend,
  };
};

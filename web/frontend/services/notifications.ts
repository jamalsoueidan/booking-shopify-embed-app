import useSWR, { useSWRConfig } from 'swr';
import { useAuthenticatedFetch } from '@hooks/useAuthenticatedFetch';
import { useCallback } from 'react';

interface useNotificationsProps {
  orderId: number;
  lineItemId: number;
}

interface useNotificationsReturn {
  data: Notification[];
  isLoading: boolean;
}

export const useNotifications = ({
  orderId,
  lineItemId,
}: useNotificationsProps): useNotificationsReturn => {
  const fetch = useAuthenticatedFetch();
  const { data, error } = useSWR<NotificationsApi>(
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

interface UseSendCustomNoticationProps {
  orderId: number;
  lineItemId: number;
}

interface UseSendCustomNotificationBody {
  to: 'customer' | 'staff';
  message: string;
}

type UseSendCustomerNotificaionCreate = (
  body: UseSendCustomNotificationBody
) => Promise<ReturnApi>;

interface UseSendCustomNotificationReturn {
  send: UseSendCustomerNotificaionCreate;
}

export const useSendCustomNotification = ({
  orderId,
  lineItemId,
}: UseSendCustomNoticationProps): UseSendCustomNotificationReturn => {
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
}: UseResendNotificationBody) => Promise<ReturnApi>;

interface UseResendNotificationReturn {
  resend: UseResendNotificaionCreate;
}

export const useResendNotification = (): UseResendNotificationReturn => {
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

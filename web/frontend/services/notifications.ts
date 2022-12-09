import useSWR from 'swr';
import { useAuthenticatedFetch } from '@hooks/useAuthenticatedFetch';

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

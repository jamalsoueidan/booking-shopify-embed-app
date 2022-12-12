import { useAuthenticatedFetch } from '@hooks/useAuthenticatedFetch';
import { format } from 'date-fns';
import useSWR from 'swr';

interface UseWidgetStaffReturn {
  data: Array<WidgetStaff>;
}

interface UseWidgetStaffProps {
  productId: number;
}

export const useWidgetStaff = ({
  productId,
}: UseWidgetStaffProps): UseWidgetStaffReturn => {
  const fetch = useAuthenticatedFetch();

  const { data } = useSWR<WidgetStaffApi>(
    `/api/widget/staff?productId=${productId}`,
    (apiURL: string) => fetch(apiURL).then((r: Response) => r.json())
  );

  return { data: data?.payload };
};

interface UseWidgetDateReturn {
  data: Array<WidgetDateSchedule>;
}

interface UseWidgetDateProps {
  staff: string;
  productId: number;
  start: Date;
  end: Date;
}

export const useWidgetDate = ({
  staff,
  productId,
  start,
  end,
}: UseWidgetDateProps): UseWidgetDateReturn => {
  const fetch = useAuthenticatedFetch();
  const { data } = useSWR<WidgetDateApi>(
    staff &&
      productId &&
      `/api/widget/availability-range?productId=${productId}&start=${format(
        start,
        'yyyy-MM-dd'
      )}&end=${format(end, 'yyyy-MM-dd')}${staff ? `&staffId=${staff}` : ''}`,
    (url: string) => fetch(url).then((r: Response) => r.json())
  );

  return { data: data?.payload };
};

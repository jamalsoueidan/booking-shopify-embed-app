import { useAuthenticatedFetch } from '@hooks/useAuthenticatedFetch';
import useSWR from 'swr';

export const useWidgetStaff = ({ productId }: WidgetStaffQuery) => {
  const fetch = useAuthenticatedFetch();

  const { data } = useSWR<ApiResponse<Array<WidgetStaff>>>(
    `/api/widget/staff?productId=${productId}`,
    (apiURL: string) => fetch(apiURL).then((r: Response) => r.json())
  );

  return { data: data?.payload };
};

export const useWidgetDate = ({
  staff,
  productId,
  start,
  end,
}: WidgetDateQuery) => {
  const fetch = useAuthenticatedFetch();
  const { data } = useSWR<ApiResponse<Array<WidgetSchedule>>>(
    staff &&
      productId &&
      `/api/widget/availability-range?productId=${productId}&start=${start}&end=${end}${
        staff ? `&staff=${staff}` : ''
      }`,
    (url: string) => fetch(url).then((r: Response) => r.json())
  );

  return { data: data?.payload };
};

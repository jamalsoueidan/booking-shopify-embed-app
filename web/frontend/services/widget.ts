import { useFetch } from '@hooks';
import { useQuery } from 'react-query';

export const useWidgetStaff = ({ productId }: WidgetStaffQuery) => {
  const { get } = useFetch();

  const { data } = useQuery<ApiResponse<Array<WidgetStaff>>>(
    ['widget', 'staff', productId],
    () => get(`/api/widget/staff?productId=${productId}`)
  );

  return { data: data?.payload };
};

export const useWidgetDate = ({
  staff,
  productId,
  start,
  end,
}: WidgetDateQuery) => {
  const { get } = useFetch();
  const { data } = useQuery<ApiResponse<Array<WidgetSchedule>>>({
    queryKey: ['widget', 'availability', staff, productId],
    queryFn: () =>
      get(
        `/api/widget/availability?productId=${productId}&start=${start}&end=${end}${
          staff ? `&staff=${staff}` : ''
        }`
      ),
    enabled: staff !== undefined && productId !== undefined,
  });

  return { data: data?.payload };
};

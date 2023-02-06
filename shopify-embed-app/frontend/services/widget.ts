import { useFetch } from "@hooks/use-fetch";
import { ApiResponse, WidgetDateQuery, WidgetSchedule, WidgetStaff, WidgetStaffQuery } from "@jamalsoueidan/bsb.types";
import { useQuery } from "react-query";

export const useWidgetStaff = ({ productId }: WidgetStaffQuery) => {
  const { get, mutate } = useFetch();

  const { data } = useQuery<ApiResponse<Array<WidgetStaff>>>({
    enabled: productId > 0,
    queryFn: async () => {
      mutate(["widget", "availability"]);
      return get(`/api/widget/staff?productId=${productId}`);
    },
    queryKey: ["widget", "staff", productId],
  });

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
    enabled: !!staff && !!productId && !!start && !!end,
    queryFn: () =>
      get(
        `/api/widget/availability?productId=${productId}&start=${start}&end=${end}${
          staff ? `&staff=${staff}` : ""
        }`,
      ),
    queryKey: ["widget", "availability", staff, start, end, productId],
  });

  return { data: data?.payload };
};

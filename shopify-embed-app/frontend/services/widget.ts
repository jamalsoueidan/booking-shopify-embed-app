import { useFetch } from "@hooks/use-fetch";
import {
  ApiResponse,
  WidgetSchedule,
  WidgetServiceAvailabilityProps,
  WidgetServiceGetStaffProps,
  WidgetStaff,
} from "@jamalsoueidan/pkg.bsb-types";
import { useQuery } from "react-query";

export const useWidgetStaff = ({ productId }: WidgetServiceGetStaffProps) => {
  const { get, mutate } = useFetch();

  const { data } = useQuery<ApiResponse<Array<WidgetStaff>>>({
    enabled: productId > 0,
    queryFn: async () => {
      mutate(["widget", "availability"]);
      return get(`/api/admin/widget/staff?productId=${productId}`);
    },
    queryKey: ["widget", "staff", productId],
  });

  return { data: data?.payload };
};

export const useWidgetAvailability = ({
  staff,
  productId,
  start,
  end,
}: WidgetServiceAvailabilityProps) => {
  const { get } = useFetch();
  const { data } = useQuery<ApiResponse<Array<WidgetSchedule>>>({
    enabled: !!staff && !!productId && !!start && !!end,
    queryFn: () =>
      get(
        `/api/admin/widget/availability?productId=${productId}&start=${start.toJSON()}&end=${end.toJSON()}${
          staff ? `&staff=${staff}` : ""
        }`,
      ),
    queryKey: ["widget", "availability", staff, start, end, productId],
  });

  return { data: data?.payload };
};

import { DateTime } from "@easepick/bundle";
import { useContext } from "react";
import useSWR from "swr";
import AppContext from "../contexts/AppContext";
import FormContext from "../contexts/FormContext";

interface UseDateProps {
  date: DateTime;
}

export const useAvailability = ({ date }: UseDateProps) => {
  const { api, productId, shop } = useContext(AppContext);
  const { staff } = useContext(FormContext);
  const end = new DateTime(
    new Date(date.getFullYear(), date.getMonth() + 1, 0)
  );
  const { data } = useSWR<ApiResponse<Array<WidgetSchedule>>>(
    staff &&
      `${api}/api/widget/availability?shop=${shop}&productId=${productId}&start=${date.format(
        "YYYY-MM-DD"
      )}&end=${end.format("YYYY-MM-DD")}${
        staff?.staff ? `&staff=${staff.staff}` : ""
      }`,
    (url: string) => fetch(url).then((r) => r.json())
  );

  return { data: data?.payload };
};

import { useContext } from "react";
import useSWR from "swr";
import AppContext from "../contexts/AppContext";

export const useStaff = () => {
  const { api, productId, shop } = useContext(AppContext);

  const { data } = useSWR<ApiResponse<Array<WidgetStaff>>>(
    `${api}/api/widget/staff?shop=${shop}&productId=${productId}`,
    (url: string) => fetch(url).then((r) => r.json())
  );

  return { data: data?.payload };
};

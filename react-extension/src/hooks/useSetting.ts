import { useContext } from "react";
import useSWR from "swr";
import AppContext from "../contexts/AppContext";

export const useSettings = () => {
  const { api, shop } = useContext(AppContext);

  const { data } = useSWR<ApiResponse<Setting>>(
    `${api}/api/widget/settings?shop=${shop}`,
    (url: string) => fetch(url).then((r) => r.json())
  );

  return { data: data?.payload };
};

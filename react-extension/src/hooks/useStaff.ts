import { useContext } from "react";
import useSWR from "swr";
import AppContext from "../contexts/AppContext";

interface UseStaffReturn {
  data: Staff[];
}
export const useStaff = (): UseStaffReturn => {
  const { api, productId, shop } = useContext(AppContext);

  const { data } = useSWR(
    `${api}/api/widget/staff?shop=${shop}&productId=${productId}`,
    (url: string) => fetch(url).then((r) => r.json())
  );

  return { data: data?.payload };
};

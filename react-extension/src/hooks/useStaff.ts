import { useContext } from "react";
import useSWR from "swr";
import AppContext from "../AppContext";

export const useStaff = () => {
  const { api, productId, shop } = useContext(AppContext);

  console.log(api, productId, shop);

  const { data } = useSWR(
    `${api}/api/widget/staff?shop=${shop}&productId=${productId}`,
    (url: string) => fetch(url).then((r) => r.json())
  );

  return { data: data?.payload };
};

import { ApiResponse, CustomerQuery } from "@jamalsoueidan/pkg.bsb-types";
import { useFetch } from "@jamalsoueidan/pkg.bsf";

export const useCustomer = () => {
  const { get } = useFetch();
  return {
    find: async (name: string) => {
      const response = await get<ApiResponse<Array<CustomerQuery>>>({
        params: { name },
        url: "/customers",
      });
      return response.payload;
    },
  };
};

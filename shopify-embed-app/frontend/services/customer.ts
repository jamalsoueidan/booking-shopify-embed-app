import { useFetch } from "@hooks/use-fetch";
import { ApiResponse, CustomerQuery } from "@jamalsoueidan/bsb.mongodb.types";

export const useCustomer = () => {
  const { get } = useFetch();

  return {
    find: async (value: string) => {
      const response: ApiResponse<Array<CustomerQuery>> = await get(
        `/api/admin/customers?name=${value}`,
      );
      return response.payload;
    },
  };
};

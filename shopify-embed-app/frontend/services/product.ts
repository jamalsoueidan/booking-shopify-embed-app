import {
  ApiResponse,
  Product,
  ProductServiceGetAvailableStaffReturn,
  ProductServiceUpdateBodyProps,
  ProductServiceUpdateBodyStaffProperty,
  ProductServiceUpdateQueryProps,
} from "@jamalsoueidan/pkg.bsb-types";
import { useFetch } from "@jamalsoueidan/pkg.bsf";
import { useCallback } from "react";
import { useQuery } from "react-query";

export const useProducts = () => {
  const { get } = useFetch();

  const { data } = useQuery([`products`], () =>
    get<ApiResponse<Array<Product>>>({ url: "/products" }),
  );

  return {
    data: data?.payload,
  };
};

export const useProductGet = ({ id }: ProductServiceUpdateQueryProps) => {
  const { get } = useFetch();

  const { data } = useQuery<
    ApiResponse<Product<ProductServiceUpdateBodyStaffProperty>>
  >([`products`, id], () => get({ url: `/products/${id}` }), {
    enabled: !!id,
  });

  return {
    data: data?.payload,
  };
};

export const useProductUpdate = ({ id }: ProductServiceUpdateQueryProps) => {
  const { put, mutate } = useFetch();
  const update = useCallback(
    async (body: ProductServiceUpdateBodyProps) => {
      const response: ApiResponse<Product> = await put({
        body,
        url: `/products/${id}`,
      });
      await mutate(["products", id]);
      await mutate(["collections"]);
      return response.payload;
    },
    [put, id, mutate],
  );

  return {
    update,
  };
};

export const useProductStaff = () => {
  const { get } = useFetch();

  const { data } = useQuery([`products`, "staff"], () =>
    get<ApiResponse<Array<ProductServiceGetAvailableStaffReturn>>>({
      url: `/products/staff/get-available`,
    }),
  );

  return {
    data: data?.payload,
  };
};

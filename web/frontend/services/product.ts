import { useCallback } from 'react';
import { useFetch } from '@hooks';
import { useQuery } from 'react-query';

export const useProducts = () => {
  const { get } = useFetch();

  const { data } = useQuery<ApiResponse<Array<Product>>>([`products`], () =>
    get(`/api/admin/products`)
  );

  return {
    data: data?.payload,
  };
};

interface UseProductGetProps {
  productId: string;
}

export const useProductGet = ({ productId }: UseProductGetProps) => {
  const { get } = useFetch();

  const { data } = useQuery<ApiResponse<ProductAggreate>>(
    [`products`, productId],
    () => get(`/api/admin/products/${productId}`),
    {
      enabled: !!productId,
    }
  );

  return {
    data: data?.payload,
  };
};

interface UseProductUpdateProps {
  productId: string;
}

type UseProductUpdateFetch = (body: ProductUpdateBody) => Promise<Product>;

export const useProductUpdate = ({ productId }: UseProductUpdateProps) => {
  const { put, mutate } = useFetch();
  const update: UseProductUpdateFetch = useCallback(
    async (body) => {
      const response: Product = await put(
        `/api/admin/products/${productId}`,
        body
      );
      await mutate(['products', productId]);
      await mutate(['collections']);
      return response;
    },
    [put, mutate]
  );

  return {
    update,
  };
};

interface UseProductStaffListProps {
  productId: string;
}

export const useProductStaff = ({ productId }: UseProductStaffListProps) => {
  const { get } = useFetch();

  const { data } = useQuery<ApiResponse<Array<ProductAddStaff>>>(
    [`products`, productId, 'staff'],
    () => get(`/api/admin/products/${productId}/staff`),
    { enabled: !!productId }
  );

  return {
    data: data?.payload,
  };
};

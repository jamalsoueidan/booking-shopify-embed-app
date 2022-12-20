import { useCallback } from 'react';
import { useFetch } from '@hooks';
import { useQuery } from 'react-query';

interface UseCollectionProductGetProps {
  productId: string;
}

export const useCollectionProductGet = ({
  productId,
}: UseCollectionProductGetProps) => {
  const { get } = useFetch();

  const { data } = useQuery<ApiResponse<ProductAggreate>>(
    [`products`, productId],
    () => get(`/api/admin/products/${productId}`)
  );

  return {
    data: data?.payload,
  };
};

interface UseCollectionProductUpdateProps {
  productId: string;
}

type UseCollectionProductUpdateFetch = (
  body: ProductUpdateBody
) => Promise<Product>;

export const useCollectionProductUpdate = ({
  productId,
}: UseCollectionProductUpdateProps) => {
  const { put, mutate } = useFetch();
  const update: UseCollectionProductUpdateFetch = useCallback(
    async (body) => {
      const response: Product = await put(
        `/api/admin/products/${productId}`,
        body
      );
      mutate(['products', productId]);
      return response;
    },
    [put, mutate]
  );

  return {
    update,
  };
};

interface UseCollectionProductStaffListProps {
  productId: string;
}

export const useCollectionProductStaff = ({
  productId,
}: UseCollectionProductStaffListProps) => {
  const { get } = useFetch();

  const { data } = useQuery<ApiResponse<Array<ProductAddStaff>>>(
    [`products`, productId, 'staff'],
    () => get(`/api/admin/products/${productId}/staff`)
  );

  return {
    data: data?.payload,
  };
};

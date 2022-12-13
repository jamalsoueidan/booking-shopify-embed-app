import { useCallback } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { useAuthenticatedFetch } from '@hooks/useAuthenticatedFetch';

interface UseCollectionProductGetProps {
  productId: string;
}

const useCollectionProductGet = ({
  productId,
}: UseCollectionProductGetProps) => {
  const fetch = useAuthenticatedFetch();

  const { data } = useSWR<ApiResponse<ProductAggreate>>(
    `/api/admin/products/${productId}`,
    (apiURL: string) => fetch(apiURL).then((r: Response) => r.json())
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

const useCollectionProductUpdate = ({
  productId,
}: UseCollectionProductUpdateProps) => {
  const { mutate } = useSWRConfig();
  const fetch = useAuthenticatedFetch();
  const update: UseCollectionProductUpdateFetch = useCallback(async (body) => {
    const response: Product = await fetch(`/api/admin/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    });
    mutate(`/api/admin/products/${productId}`);
    return response;
  }, []);

  return {
    update,
  };
};

interface UseCollectionProductStaffListProps {
  productId: string;
}

const useCollectionProductStaff = ({
  productId,
}: UseCollectionProductStaffListProps) => {
  const fetch = useAuthenticatedFetch();

  const { data } = useSWR<ApiResponse<Array<ProductAddStaff>>>(
    `/api/admin/products/${productId}/staff`,
    (apiURL: string) => fetch(apiURL).then((r: Response) => r.json())
  );

  return {
    data: data?.payload,
  };
};

export {
  useCollectionProductGet,
  useCollectionProductUpdate,
  useCollectionProductStaff,
};

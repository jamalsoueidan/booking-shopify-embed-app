import { useCallback } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { useAuthenticatedFetch } from '@hooks/useAuthenticatedFetch';

interface UseCollectionProductGetProps {
  productId: string;
}

interface UseCollectionProductGetReturn {
  data: Product;
}

const useCollectionProductGet = ({
  productId,
}: UseCollectionProductGetProps): UseCollectionProductGetReturn => {
  const fetch = useAuthenticatedFetch();

  const { data } = useSWR<ProductApi>(
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

type UseCollectionProductUpdateBody = Partial<Omit<Product, '_id'>>;
interface UseCollectionProductUpdateReturn {
  update: (body: UseCollectionProductUpdateBody) => void;
}

const useCollectionProductUpdate = ({
  productId,
}: UseCollectionProductUpdateProps): UseCollectionProductUpdateReturn => {
  const { mutate } = useSWRConfig();
  const fetch = useAuthenticatedFetch();
  const update = useCallback(async (body: UseCollectionProductUpdateBody) => {
    const result = await fetch(`/api/admin/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    }).then((res: Response) => res.json());
    mutate(`/api/admin/products/${productId}`);
    return result;
  }, []);

  return {
    update,
  };
};

export { useCollectionProductGet, useCollectionProductUpdate };

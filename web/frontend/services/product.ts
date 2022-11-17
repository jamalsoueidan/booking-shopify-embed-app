import { useCallback } from 'react';
import { useSWRConfig } from 'swr';
import { useAuthenticatedFetch } from '../hooks';

export const updateProduct = (productId: string) => {
  const { mutate } = useSWRConfig();
  const fetch = useAuthenticatedFetch();
  return useCallback(async (body: Partial<Omit<Product, '_id'>>) => {
    const result = await fetch(`/api/admin/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    }).then((res: Response) => res.json());
    mutate(`/api/admin/products/${productId}`);
    return result;
  }, []);
};

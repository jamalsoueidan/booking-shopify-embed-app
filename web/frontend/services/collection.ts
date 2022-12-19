import { useCallback } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { useAuthenticatedFetch } from '@hooks/useAuthenticatedFetch';

export const useCollection = () => {
  const fetch = useAuthenticatedFetch();
  const { data } = useSWR<ApiResponse<Array<CollectionAggreate>>>(
    '/api/admin/collections',
    (apiURL: string) => fetch(apiURL).then((r: Response) => r.json())
  );

  return {
    data: data?.payload,
  };
};

type UseCollectionCreateFetch = ({ selections }: CollectionBodyCreate) => void;

export const useCollectionCreate = () => {
  const fetch = useAuthenticatedFetch();
  const { mutate } = useSWRConfig();

  const create: UseCollectionCreateFetch = useCallback(
    async ({ selections }) => {
      await fetch('/api/admin/collections', {
        method: 'POST',
        body: JSON.stringify({ selections }),
        headers: { 'Content-Type': 'application/json' },
      });
      mutate('/api/admin/collections');
    },
    []
  );

  return {
    create,
  };
};

interface UseCollectionDestroyProps {
  collectionId: string;
}

type UseCollectionDestroyFetch = () => void;

export const useCollectionDestroy = ({
  collectionId,
}: UseCollectionDestroyProps) => {
  const fetch = useAuthenticatedFetch();
  const { mutate } = useSWRConfig();

  const destroy: UseCollectionDestroyFetch = useCallback(async () => {
    await fetch(`/api/admin/collections/${collectionId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    await mutate('/api/admin/collections');
  }, []);

  return {
    destroy,
  };
};

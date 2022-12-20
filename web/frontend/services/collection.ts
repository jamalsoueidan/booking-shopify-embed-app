import { useFetch } from '@hooks';
import { useCallback } from 'react';
import { useQuery } from 'react-query';

export const useCollection = () => {
  const { get } = useFetch();
  const { data } = useQuery<ApiResponse<Array<CollectionAggreate>>>(
    ['collections'],
    () => get('/api/admin/collections')
  );

  return {
    data: data?.payload,
  };
};

type UseCollectionCreateFetch = ({ selections }: CollectionBodyCreate) => void;

export const useCollectionCreate = () => {
  const { post, mutate } = useFetch();

  const create: UseCollectionCreateFetch = useCallback(
    async ({ selections }) => {
      const response = await post('/api/admin/collections', { selections });
      mutate(['collections']);
      return response;
    },
    [mutate, post]
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
  const fetch = useFetch();

  const destroy: UseCollectionDestroyFetch = useCallback(async () => {
    await fetch.destroy(`/api/admin/collections/${collectionId}`);
    fetch.mutate(['collections']);
  }, [fetch]);

  return {
    destroy,
  };
};

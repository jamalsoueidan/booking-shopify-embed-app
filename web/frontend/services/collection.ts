import { useCallback } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { useAuthenticatedFetch } from '@hooks/useAuthenticatedFetch';

interface useCollectionListReturn {
  data: Collection[];
}
const useCollectionList = (): useCollectionListReturn => {
  const fetch = useAuthenticatedFetch();
  const { data } = useSWR<CollectionsApi>(
    '/api/admin/collections',
    (apiURL: string) => fetch(apiURL).then((r: Response) => r.json())
  );

  return {
    data: data?.payload,
  };
};

interface UseCollectionCreateReturn {
  create: (selections: string[]) => void;
}
const useCollectionCreate = (): UseCollectionCreateReturn => {
  const fetch = useAuthenticatedFetch();
  const { mutate } = useSWRConfig();

  const create = useCallback(async (selections: string[]) => {
    await fetch('/api/admin/collections', {
      method: 'POST',
      body: JSON.stringify({ selections }),
      headers: { 'Content-Type': 'application/json' },
    });
    mutate('/api/admin/collections');
  }, []);

  return {
    create,
  };
};

interface UseCollectionDestroyProps {
  collectionId: string;
}

interface UseCollectionDestroyReturn {
  destroy: () => void;
}

const useCollectionDestroy = ({
  collectionId,
}: UseCollectionDestroyProps): UseCollectionDestroyReturn => {
  const fetch = useAuthenticatedFetch();
  const { mutate } = useSWRConfig();

  const destroy = useCallback(async () => {
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

export { useCollectionList, useCollectionCreate, useCollectionDestroy };

import { useAuthenticatedFetch } from '@hooks/useAuthenticatedFetch';
import { useCallback, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';

interface UseCollectionProductStaffListProps {
  productId: string;
}

interface UseCollectionProductStaffListReturn {
  data: ProductStaff[];
}

const useCollectionProductStaffList = ({
  productId,
}: UseCollectionProductStaffListProps): UseCollectionProductStaffListReturn => {
  const fetch = useAuthenticatedFetch();

  const { data } = useSWR<ProductStaffApi>(
    `/api/admin/products/${productId}/staff`,
    (apiURL: string) => fetch(apiURL).then((r: Response) => r.json())
  );

  return {
    data: data?.payload,
  };
};

interface UseCollectionProductStaffDestroyProps {
  productId: string;
}

interface UseStaffScheduleDestroyFetchProps {
  staffId: string;
}

interface UseCollectionProductStaffDestroyReturn {
  isDestroying: boolean;
  destroy: (props: UseStaffScheduleDestroyFetchProps) => void;
}

const useCollectionProductStaffDestroy = ({
  productId,
}: UseCollectionProductStaffDestroyProps): UseCollectionProductStaffDestroyReturn => {
  const [isDestroying, setIsDestroying] = useState<boolean>();
  const fetch = useAuthenticatedFetch();
  const { mutate } = useSWRConfig();
  const destroy = useCallback(
    async ({ staffId }: UseStaffScheduleDestroyFetchProps) => {
      setIsDestroying(true);
      await fetch(`/api/admin/products/${productId}/staff/${staffId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      await mutate(`/api/admin/products/${productId}/staff`);
      await mutate(`/api/admin/products/${productId}/staff-to-add`);
      setIsDestroying(false);
    },
    []
  );

  return {
    isDestroying,
    destroy,
  };
};

interface UseCollectionProductStaffToAddProps
  extends UseCollectionProductStaffDestroyProps {}

interface UseCollectionProductStaffToAddReturn {
  data: ProductStaffToAdd[];
}

const useCollectionProductStaffToAdd = ({
  productId,
}: UseCollectionProductStaffToAddProps): UseCollectionProductStaffToAddReturn => {
  const fetch = useAuthenticatedFetch();

  const { data } = useSWR<ProductStaffToAddApi>(
    `/api/admin/products/${productId}/staff-to-add`,
    (apiURL: string) => fetch(apiURL).then((r: Response) => r.json())
  );

  return {
    data: data?.payload,
  };
};

interface UseCollectionProductStaffCreateProps
  extends UseCollectionProductStaffDestroyProps {}

interface UseCollectionProductStaffCreateFetchProps {
  staffId: string;
  tag: string;
}

interface UseCollectionProductStaffCreateReturn {
  create: (props: UseCollectionProductStaffCreateFetchProps) => void;
}

const useCollectionProductStaffCreate = ({
  productId,
}: UseCollectionProductStaffCreateProps): UseCollectionProductStaffCreateReturn => {
  const fetch = useAuthenticatedFetch();
  const { mutate } = useSWRConfig();
  const create = useCallback(
    async ({ staffId, tag }: UseCollectionProductStaffCreateFetchProps) => {
      await fetch(`/api/admin/products/${productId}/staff`, {
        method: 'POST',
        body: JSON.stringify({ staff: staffId, tag }),
        headers: { 'Content-Type': 'application/json' },
      });
      mutate(`/api/admin/products/${productId}/staff`);
      mutate(`/api/admin/products/${productId}/staff-to-add`);
    },
    []
  );

  return {
    create,
  };
};

export {
  useCollectionProductStaffList,
  useCollectionProductStaffDestroy,
  useCollectionProductStaffToAdd,
  useCollectionProductStaffCreate,
};

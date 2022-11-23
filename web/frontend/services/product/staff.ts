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

interface UseCollectionProductStaffProps {
  productId: string;
}

interface UseCollectionProductStaffToAddReturn {
  data: ProductStaffToAdd[];
}

const useCollectionProductStaff = ({
  productId,
}: UseCollectionProductStaffProps): UseCollectionProductStaffToAddReturn => {
  const fetch = useAuthenticatedFetch();

  const { data } = useSWR<ProductStaffToAddApi>(
    `/api/admin/products/${productId}/staff`,
    (apiURL: string) => fetch(apiURL).then((r: Response) => r.json())
  );

  return {
    data: data?.payload,
  };
};

export { useCollectionProductStaffList, useCollectionProductStaff };

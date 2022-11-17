import { useAuthenticatedFetch } from '@hooks/useAuthenticatedFetch';
import { useCallback } from 'react';
import useSWR, { useSWRConfig } from 'swr';

interface UseStaffListReturn {
  data: Staff[];
}

const useStaffList = (): UseStaffListReturn => {
  const fetch = useAuthenticatedFetch();

  const { data } = useSWR<StafferApi>('/api/admin/staff', (apiURL: string) =>
    fetch(apiURL).then((r: Response) => r.json())
  );

  return { data: data?.payload };
};

interface UpdateOrCreateProps extends Omit<Staff, '_id' | 'shop'> {}

interface UseStaffGetProps {
  userId: string;
}

interface UseStaffGetReturn {
  data: Staff;
  update?: (body: UpdateOrCreateProps) => void;
}

const useStaffGet = ({ userId }: UseStaffGetProps): UseStaffGetReturn => {
  const fetch = useAuthenticatedFetch();

  const { data } = useSWR<StaffApi>(
    `/api/admin/staff/${userId}`,
    (apiURL: string) => fetch(apiURL).then((r: Response) => r.json())
  );

  return {
    data: data?.payload,
  };
};

interface UseStaffCreateReturn {
  create: (body: UpdateOrCreateProps) => void;
}

const useStaffCreate = (): UseStaffCreateReturn => {
  const { mutate } = useSWRConfig();
  const fetch = useAuthenticatedFetch();

  const create = useCallback(async (body: UpdateOrCreateProps) => {
    await fetch('/api/admin/staff', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    });
    await mutate(`/api/admin/staff`);
  }, []);

  return {
    create,
  };
};

interface UseStaffUpdateProps {
  userId: string;
}
interface UseStaffUpdateReturn {
  update: (body: UpdateOrCreateProps) => void;
}

const useStaffUpdate = ({
  userId,
}: UseStaffUpdateProps): UseStaffUpdateReturn => {
  const { mutate } = useSWRConfig();
  const fetch = useAuthenticatedFetch();

  const update = useCallback(
    async (body: UpdateOrCreateProps) => {
      await fetch('/api/admin/staff/' + userId, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      });
      await mutate(`/api/admin/staff`);
      await mutate(`/api/admin/staff/${userId}`);
    },
    [userId]
  );

  return {
    update,
  };
};

export { useStaffList, useStaffGet, useStaffCreate, useStaffUpdate };

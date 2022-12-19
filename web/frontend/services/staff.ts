import { useAuthenticatedFetch } from '@hooks/useAuthenticatedFetch';
import { useCallback } from 'react';
import useSWR, { useSWRConfig } from 'swr';

export const useStaff = () => {
  const fetch = useAuthenticatedFetch();

  const { data } = useSWR<ApiResponse<Array<Staff>>>(
    '/api/admin/staff',
    (apiURL: string) => fetch(apiURL).then((r: Response) => r.json())
  );

  return { data: data?.payload };
};

interface UseStaffGetProps {
  userId: string;
}

export const useStaffGet = ({ userId }: UseStaffGetProps) => {
  const fetch = useAuthenticatedFetch();

  const { data } = useSWR<ApiResponse<Staff>>(
    `/api/admin/staff/${userId}`,
    (apiURL: string) => fetch(apiURL).then((r: Response) => r.json())
  );

  return {
    data: data?.payload,
  };
};

type UseStaffCreateFetch = (body: StaffBodyUpdate) => Promise<Staff>;

export const useStaffCreate = () => {
  const { mutate } = useSWRConfig();
  const fetch = useAuthenticatedFetch();

  const create: UseStaffCreateFetch = useCallback(async (body) => {
    const response: Staff = await fetch('/api/admin/staff', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    }).then((r: Response) => r.json());
    await mutate(`/api/admin/staff`);
    return response;
  }, []);

  return {
    create,
  };
};

interface UseStaffUpdateProps {
  userId: string;
}

type UseStaffUpdateFetch = (body: StaffBodyUpdate) => Promise<Staff>;

export const useStaffUpdate = ({ userId }: UseStaffUpdateProps) => {
  const { mutate } = useSWRConfig();
  const fetch = useAuthenticatedFetch();

  const update: UseStaffUpdateFetch = useCallback(
    async (body) => {
      const response: Staff = await fetch('/api/admin/staff/' + userId, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      });
      await mutate(`/api/admin/staff`);
      await mutate(`/api/admin/staff/${userId}`);
      return response;
    },
    [userId]
  );

  return {
    update,
  };
};

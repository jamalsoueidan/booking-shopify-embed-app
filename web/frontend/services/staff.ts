import { useFetch } from '@hooks';
import { useCallback } from 'react';
import { useQuery } from 'react-query';

export const useStaff = () => {
  const { get } = useFetch();

  const { data } = useQuery<ApiResponse<Array<Staff>>>(['staff'], () =>
    get('/api/admin/staff')
  );

  return { data: data?.payload };
};

interface UseStaffGetProps {
  userId: string;
}

export const useStaffGet = ({ userId }: UseStaffGetProps) => {
  const { get } = useFetch();

  const { data } = useQuery<ApiResponse<Staff>>(['staff', userId], () =>
    get(`/api/admin/staff/${userId}`)
  );

  return {
    data: data?.payload,
  };
};

type UseStaffCreateFetch = (body: StaffBodyUpdate) => Promise<Staff>;

export const useStaffCreate = () => {
  const { post, mutate } = useFetch();

  const create: UseStaffCreateFetch = useCallback(
    async (body) => {
      const response: Staff = await post('/api/admin/staff', body);
      await mutate(['staff']);
      return response;
    },
    [post, mutate]
  );

  return {
    create,
  };
};

interface UseStaffUpdateProps {
  userId: string;
}

type UseStaffUpdateFetch = (body: StaffBodyUpdate) => Promise<Staff>;

export const useStaffUpdate = ({ userId }: UseStaffUpdateProps) => {
  const { put, mutate } = useFetch();

  const update: UseStaffUpdateFetch = useCallback(
    async (body) => {
      const response: Staff = await put('/api/admin/staff/' + userId, body);
      await mutate(['staff']);
      return response;
    },
    [put, mutate]
  );

  return {
    update,
  };
};

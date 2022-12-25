import { useFetch } from '@hooks';
import { useCallback } from 'react';
import { useQuery } from 'react-query';

export const useSetting = () => {
  const { get } = useFetch();
  const { data: setting } = useQuery<ApiResponse<Setting>>({
    queryKey: ['settings'],
    queryFn: () => get(`/api/admin/setting`),
    refetchOnWindowFocus: false,
  });

  return {
    data: setting?.payload || null,
  };
};

type UseSettingUpdateFetch = (body: SettingBodyUpdate) => Promise<Setting>;

export const useSettingUpdate = () => {
  const { put, mutate } = useFetch();

  const update: UseSettingUpdateFetch = useCallback(
    async (body) => {
      const response: Setting = await put(`/api/admin/setting`, body);
      mutate(['setting']);
      return response;
    },
    [put, mutate]
  );

  return {
    update,
  };
};

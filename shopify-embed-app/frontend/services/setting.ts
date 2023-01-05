import { useFetch } from '@hooks';
import { useCallback } from 'react';
import { useQuery } from 'react-query';

export const useSetting = () => {
  const { get } = useFetch();
  const { data, ...rest } = useQuery<ApiResponse<Setting>>({
    queryKey: ['setting'],
    queryFn: () => get(`/api/admin/setting`),
    refetchOnWindowFocus: false,
  });

  return {
    data: data?.payload || null,
    ...rest,
  };
};

type UseSettingUpdateFetch = (
  body: SettingBodyUpdate
) => Promise<ApiResponse<Setting>>;

export const useSettingUpdate = () => {
  const { put, mutate } = useFetch();

  const update: UseSettingUpdateFetch = useCallback(
    async (body) => {
      const response: ApiResponse<Setting> = await put(
        `/api/admin/setting`,
        body
      );
      await mutate(['setting']);
      return response;
    },
    [put, mutate]
  );

  return {
    update,
  };
};

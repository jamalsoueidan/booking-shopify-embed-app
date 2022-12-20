import { useCallback, useMemo } from 'react';
import { useFetch } from '@hooks';
import { useQuery } from 'react-query';

export const useSetting = () => {
  const { get } = useFetch();
  const { data: setting } = useQuery<ApiResponse<Setting>>(['settings'], () =>
    get(`/api/admin/setting`)
  );

  const data = useMemo(() => {
    return (
      setting?.payload || {
        _id: '',
        shop: '',
        timeZone: 'Europe/Paris',
        language: 'en',
        status: true,
      }
    );
  }, [setting]);

  return {
    data,
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

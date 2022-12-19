import { useCallback, useMemo } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { useAuthenticatedFetch } from '@hooks/useAuthenticatedFetch';

export const useSetting = () => {
  const fetch = useAuthenticatedFetch();
  const { data: setting } = useSWR<ApiResponse<Setting>>(
    `/api/admin/setting`,
    (url: string) => fetch(url).then((res: Response) => res.json())
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
  const fetch = useAuthenticatedFetch();
  const { mutate } = useSWRConfig();

  const update: UseSettingUpdateFetch = useCallback(async (body) => {
    const response: Setting = await fetch(`/api/admin/setting`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    }).then((res: Response) => res.json());
    await mutate(`/api/admin/setting`);
    return response;
  }, []);

  return {
    update,
  };
};

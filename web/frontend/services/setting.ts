import { useCallback } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { useAuthenticatedFetch } from '@hooks/useAuthenticatedFetch';

interface UseSettingGetReturn {
  data: Setting;
}

const useSettingGet = (): UseSettingGetReturn => {
  const fetch = useAuthenticatedFetch();
  const { data } = useSWR<ApiResponse<Setting>>(
    `/api/admin/setting`,
    (url: string) => fetch(url).then((res: Response) => res.json())
  );

  return {
    data: data?.payload || {
      _id: '',
      shop: '',
      timeZone: 'Europe/Paris',
      language: 'en',
      status: true,
    },
  };
};

type UseSettingUpdateFetch = (body: SettingBodyUpdate) => Promise<Setting>;

interface UseSettingUpdateReturn {
  update: UseSettingUpdateFetch;
}

const useSettingUpdate = (): UseSettingUpdateReturn => {
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

export { useSettingUpdate, useSettingGet };

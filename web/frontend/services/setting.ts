import { useCallback } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { useAuthenticatedFetch } from '@hooks/useAuthenticatedFetch';

interface UseSettingGetReturn {
  data: Setting;
}

const useSettingGet = (): UseSettingGetReturn => {
  const fetch = useAuthenticatedFetch();
  const { data } = useSWR<SettingApi>(`/api/admin/setting`, (url: string) =>
    fetch(url).then((res: Response) => res.json())
  );

  return {
    data: data?.payload || { timeZone: 'Europe/Paris', language: 'en' },
  };
};

interface SettingBody extends Setting {}

interface UseSettingUpdateReturn {
  update: (body: SettingBody) => void;
}

const useSettingUpdate = (): UseSettingUpdateReturn => {
  const fetch = useAuthenticatedFetch();
  const { mutate } = useSWRConfig();

  const update = useCallback(async (body: SettingBody) => {
    await fetch(`/api/admin/setting`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    }).then((res: Response) => res.json());
    await mutate(`/api/admin/setting`);
  }, []);

  return {
    update,
  };
};

export { useSettingUpdate, useSettingGet };

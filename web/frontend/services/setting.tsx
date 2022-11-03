import { useCallback } from 'react';
import useSWR from 'swr';
import { useAuthenticatedFetch } from '../hooks';

interface UpdateSettingBody {
  timeZone: string;
  language: string;
}

export const useSetting = () => {
  const fetch = useAuthenticatedFetch();

  const { data } = useSWR<SettingApi>(`/api/admin/setting`, (url: string) =>
    fetch(url).then((res: Response) => res.json())
  );

  return data?.payload || { timeZone: 'European/Paris', language: 'en' };
};

export const updateSetting = () => {
  const fetch = useAuthenticatedFetch();

  return useCallback(async (body: UpdateSettingBody) => {
    return await fetch(`/api/admin/setting`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    }).then((res: Response) => res.json());
  }, []);
};

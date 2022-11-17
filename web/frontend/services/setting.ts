import { useCallback } from 'react';
import useSWR from 'swr';
import { useAuthenticatedFetch } from '../hooks';

interface SettingBody {
  timeZone: string;
  language: string;
}

interface UseSettingReturn {
  data: Setting;
  update: (body: SettingBody) => void;
}

export default (): UseSettingReturn => {
  const fetch = useAuthenticatedFetch();

  const { data } = useSWR<SettingApi>(`/api/admin/setting`, (url: string) =>
    fetch(url).then((res: Response) => res.json())
  );

  const update = useCallback(async (body: SettingBody) => {
    return await fetch(`/api/admin/setting`, {
      method: 'PUT',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' },
    }).then((res: Response) => res.json());
  }, []);

  return {
    data: data?.payload || { timeZone: 'Europe/Paris', language: 'en' },
    update,
  };
};

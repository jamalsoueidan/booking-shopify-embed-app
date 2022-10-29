import { useCallback } from "react";
import useSWR from "swr";
import { useAuthenticatedFetch } from "../hooks";

export const useSetting = () => {
  const fetch = useAuthenticatedFetch();

  const { data } = useSWR<SettingApi>(`/api/admin/setting`, (url: string) =>
    fetch(url).then((res) => res.json())
  );

  return data?.payload || { timeZone: "European/Paris", language: "en" };
};

export const updateSetting = () => {
  const fetch = useAuthenticatedFetch();

  return useCallback(async (body) => {
    return await fetch(`/api/admin/setting`, {
      method: "PUT",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    }).then((res) => res.json());
  }, []);
};

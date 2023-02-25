import {
  ApiResponse,
  Setting,
  SettingBodyUpdate,
} from "@jamalsoueidan/pkg.bsb-types";
import { useFetch } from "@jamalsoueidan/pkg.bsf";
import { useCallback } from "react";
import { useQuery } from "react-query";

export const useSetting = () => {
  const { get } = useFetch();
  const { data, ...rest } = useQuery<ApiResponse<Setting>>({
    queryFn: () => get({ url: "/setting" }),
    queryKey: ["setting"],
    refetchOnWindowFocus: false,
  });

  return {
    data: data?.payload || null,
    ...rest,
  };
};

type UseSettingUpdateFetch = (
  body: SettingBodyUpdate,
) => Promise<ApiResponse<Setting>>;

export const useSettingUpdate = () => {
  const { put, mutate } = useFetch();

  const update: UseSettingUpdateFetch = useCallback(
    async (body) => {
      const response: ApiResponse<Setting> = await put({
        body,
        url: `/setting`,
      });
      await mutate(["setting"]);
      return response;
    },
    [put, mutate],
  );

  return {
    update,
  };
};

import { useFetch } from "@hooks/use-fetch";
import {
  ApiResponse,
  NotificationTemplate,
  NotificationTemplateBodyUpdate,
} from "@jamalsoueidan/pkg.bsb-types";
import { useCallback } from "react";
import { useQuery } from "react-query";

export const useNotificationTemplates = ({ language }: any) => {
  const { get } = useFetch();
  const { data, ...rest } = useQuery<ApiResponse<Array<NotificationTemplate>>>({
    queryFn: () =>
      get(`/api/admin/setting/notification-templates?language=${language}`),
    queryKey: ["notification-templates"],
    refetchOnWindowFocus: false,
  });

  return {
    data: data?.payload || null,
    ...rest,
  };
};

type UseNotificationTemplatesUpdateFetch = (
  body: NotificationTemplateBodyUpdate[],
) => Promise<any>;

export const useNotificationTemplatesUpdate = () => {
  const { put, mutate } = useFetch();

  const update: UseNotificationTemplatesUpdateFetch = useCallback(
    async (body) => {
      const response = await put(
        `/api/admin/setting/notification-templates`,
        body,
      );
      await mutate(["notification-templates"]);
      return response;
    },
    [put, mutate],
  );

  return {
    update,
  };
};

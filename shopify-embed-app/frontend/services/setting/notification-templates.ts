import {
  ApiResponse,
  NotificationTemplate,
  NotificationTemplateBodyUpdate,
} from "@jamalsoueidan/pkg.backend-types";
import { useFetch } from "@jamalsoueidan/pkg.frontend";
import { useCallback } from "react";
import { useQuery } from "react-query";

export const useNotificationTemplates = (params: any) => {
  const { get } = useFetch();
  const { data, ...rest } = useQuery<ApiResponse<Array<NotificationTemplate>>>({
    queryFn: () =>
      get({
        params,
        url: "/setting/notification-templates",
      }),
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
      const response = await put({
        body,
        url: `/setting/notification-templates`,
      });
      await mutate(["notification-templates"]);
      return response;
    },
    [put, mutate],
  );

  return {
    update,
  };
};

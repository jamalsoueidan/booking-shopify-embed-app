import {
  FetchContextType,
  UseURLOptions,
  useUrl,
} from "@jamalsoueidan/pkg.frontend";
import { useCallback } from "react";
import { useQueryClient } from "react-query";
import { useAuthenticatedFetch } from "./useAuthenticatedFetch";

export const useFetch = (): FetchContextType => {
  const fetch = useAuthenticatedFetch();
  const queryClient = useQueryClient();
  const { createURL } = useUrl("/api/admin", {
    shop: "testeriphone.myshopify.com",
  });

  const put = useCallback(
    (options: UseURLOptions) =>
      fetch(createURL(options), {
        method: "PUT",
        ...(options.body ? { body: JSON.stringify(options.body) } : null),
        headers: { "Content-Type": "application/json" },
      }).then((r: Response) => r.json()),
    [createURL, fetch],
  );

  const destroy = useCallback(
    (options: UseURLOptions) =>
      fetch(createURL(options), {
        headers: { "Content-Type": "application/json" },
        method: "DELETE",
      }).then((r: Response) => r.json()),
    [createURL, fetch],
  );

  const post = useCallback(
    (options: UseURLOptions) =>
      fetch(createURL(options), {
        method: "POST",
        ...(options.body ? { body: JSON.stringify(options.body) } : null),
        headers: { "Content-Type": "application/json" },
      }).then((r: Response) => r.json()),
    [createURL, fetch],
  );

  const get = useCallback(
    (options: UseURLOptions) =>
      fetch(createURL(options))
        .then((r: Response) => r.text())
        .then((text: string) => JSON.parse(text)),
    [createURL, fetch],
  );

  return {
    destroy,
    get,
    mutate: (key: any) => queryClient.invalidateQueries(key),
    post,
    put,
  };
};

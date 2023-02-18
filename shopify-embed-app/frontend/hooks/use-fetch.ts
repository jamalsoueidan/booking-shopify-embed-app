import { useAuthenticatedFetch } from "@hooks/useAuthenticatedFetch";
import { useCallback } from "react";
import { useQueryClient } from "react-query";

export const useFetch = () => {
  const fetch = useAuthenticatedFetch();
  const queryClient = useQueryClient();

  const put = useCallback(
    (url: string, body?: any) =>
      fetch(url, {
        method: "PUT",
        ...(body ? { body: JSON.stringify(body) } : null),
        headers: { "Content-Type": "application/json" },
      }).then((r: Response) => r.json()),
    [fetch],
  );

  const destroy = useCallback(
    (url: string) =>
      fetch(url, {
        headers: { "Content-Type": "application/json" },
        method: "DELETE",
      }).then((r: Response) => r.json()),
    [fetch],
  );

  const post = useCallback(
    (url: string, body?: any) =>
      fetch(url, {
        method: "POST",
        ...(body ? { body: JSON.stringify(body) } : null),
        headers: { "Content-Type": "application/json" },
      }).then((r: Response) => r.json()),
    [fetch],
  );

  const get = useCallback(
    (url: string) =>
      fetch(url)
        .then((r: Response) => r.text())
        .then((text: string) => JSON.parse(text)),
    [fetch],
  );

  return {
    destroy,
    fetch,
    get,
    mutate: (key: any) => queryClient.invalidateQueries(key),
    post,
    put,
  };
};

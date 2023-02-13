import { useFetch } from "@hooks/use-fetch";
import {
  ApiResponse,
  CollectionServiceCreateBodyProps,
  CollectionServiceGetAllReturn,
} from "@jamalsoueidan/bsb.types";
import { useCallback, useState } from "react";
import { useQuery } from "react-query";

export const useCollection = () => {
  const { get } = useFetch();
  const { data } = useQuery<ApiResponse<Array<CollectionServiceGetAllReturn>>>(
    ["collections"],
    () => get("/api/admin/collections"),
    { suspense: true },
  );

  return {
    data: data?.payload,
  };
};

export const useCollectionCreate = () => {
  const { post, mutate } = useFetch();
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isFetched, setIsFetched] = useState<boolean>(false);

  const create = useCallback(
    async ({ selections }: CollectionServiceCreateBodyProps) => {
      setIsFetching(true);
      await post("/api/admin/collections", { selections });
      mutate(["collections"]);
      setIsFetching(false);
      setIsFetched(true);
    },
    [mutate, post],
  );

  return {
    create,
    isFetched,
    isFetching,
  };
};

interface UseCollectionDestroyProps {
  collectionId: string;
}

export const useCollectionDestroy = ({
  collectionId,
}: UseCollectionDestroyProps) => {
  const fetch = useFetch();

  const destroy = useCallback(async () => {
    await fetch.destroy(`/api/admin/collections/${collectionId}`);
    fetch.mutate(["collections"]);
  }, [collectionId, fetch]);

  return {
    destroy,
  };
};

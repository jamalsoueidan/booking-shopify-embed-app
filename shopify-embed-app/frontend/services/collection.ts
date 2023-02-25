import {
  ApiResponse,
  CollectionServiceCreateBodyProps,
  CollectionServiceGetAllReturn,
} from "@jamalsoueidan/pkg.bsb-types";
import { useFetch } from "@jamalsoueidan/pkg.bsf";
import { useCallback, useState } from "react";
import { useQuery } from "react-query";

export const useCollection = () => {
  const { get } = useFetch();
  const { data } = useQuery(["collections"], () =>
    get<ApiResponse<Array<CollectionServiceGetAllReturn>>>({
      url: "/collections",
    }),
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
    async (body: CollectionServiceCreateBodyProps) => {
      setIsFetching(true);
      await post({ body, url: "/collections" });
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
    await fetch.destroy({ url: `/collections/${collectionId}` });
    fetch.mutate(["collections"]);
  }, [collectionId, fetch]);

  return {
    destroy,
  };
};

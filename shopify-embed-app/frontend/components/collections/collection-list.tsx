import { CollectionServiceGetAllReturn } from "@jamalsoueidan/pkg.bsb-types";
import { HelperArray } from "@jamalsoueidan/pkg.bsf";
import { memo, useMemo } from "react";
import CollectionItem from "./collection-item";

interface CollectionListProps {
  collections: CollectionServiceGetAllReturn[];
}

export default memo(({ collections }: CollectionListProps) => {
  const sortedCollections = useMemo(
    () => [...collections].sort(HelperArray.soryTextBy("title")),
    [collections],
  );

  return (
    <>
      {sortedCollections.map((collection) => (
        <CollectionItem key={collection._id} collection={collection} />
      ))}
    </>
  );
});

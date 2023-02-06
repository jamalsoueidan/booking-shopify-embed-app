import { CollectionAggreate } from "@jamalsoueidan/bsb.types";
import { HelperArray } from "@jamalsoueidan/bsf.bsf-pkg";
import { memo, useMemo } from "react";
import CollectionItem from "./collection-item";

interface CollectionListProps {
  collections: CollectionAggreate[];
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

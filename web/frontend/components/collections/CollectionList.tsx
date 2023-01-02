import { sortStrings } from '@libs/sortStrings';
import { memo, useMemo } from 'react';
import CollectionItem from './CollectionItem';

interface CollectionListProps {
  collections: CollectionAggreate[];
}

export default memo(({ collections }: CollectionListProps) => {
  const sortedCollections = useMemo(
    () => [...collections].sort(sortStrings('title')),
    []
  );

  return (
    <>
      {sortedCollections.map((collection) => (
        <CollectionItem
          key={collection._id}
          collection={collection}></CollectionItem>
      ))}
    </>
  );
});

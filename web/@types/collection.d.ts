interface Collection {
  _id: string;
  shop: string;
  title: string;
  collectionId: number;
}

interface CollectionAggreate extends Collection {
  products: Product<ProductStaffAggreate>[];
}

interface CollectionBodyCreate {
  selections: string[];
}

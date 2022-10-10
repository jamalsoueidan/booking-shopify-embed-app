interface Api {
  error: string;
  success: boolean;
}

interface Product {
  id: string;
  title: string;
}

interface Products {
  nodes: Array<Product>;
}

interface Collection {
  id: string;
  title: string;
  metafields: object;
  products: Products;
}

interface Collections extends Api {
  payload: Array<Collection>;
}

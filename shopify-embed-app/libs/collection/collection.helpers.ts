import { ShopifySession } from "@jamalsoueidan/pkg.bsb";
import shopify from "../../shopify.js";

interface Product {
  id: string;
  title: string;
  featuredImage: {
    url: string;
  };
}

interface Collection {
  id: string;
  title: string;
  products: {
    nodes: Array<Product>;
  };
}

interface GetCollectionQuery {
  body: {
    data: {
      collection: Collection;
    };
  };
}

const getCollectionQuery = `
  query collectionFind($id: ID!) {
    collection(id: $id) {
      id
      title
      products(first: 50) {
        nodes {
          id
          title
          featuredImage {
            url
          }
        }
      }
    }
  }
`;

export const getCollection = async (
  session: ShopifySession,
  id: string,
): Promise<Collection> => {
  const client = new shopify.api.clients.Graphql({ session } as any);

  const payload: GetCollectionQuery = await client.query({
    data: {
      query: getCollectionQuery,
      variables: {
        id,
      },
    },
  });

  return payload.body.data.collection;
};

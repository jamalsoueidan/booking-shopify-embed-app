// @ts-check
import { Shopify } from "@shopify/shopify-api";
import { Session } from "@shopify/shopify-api/dist/auth/session";

interface Metafield {
  id: string;
  namespace: string;
  key: string;
  value: string;
}
interface Product {
  id: string;
  title: string;
}

interface Collection {
  id: string;
  title: string;
  products: {
    nodes: Array<Product>;
  };
  metafields: {
    nodes: Array<Metafield>;
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
        }
      }
    }
  }
`;

export const getCollection = async (
  session: Partial<Session>,
  id: string
): Promise<Collection> => {
  const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);
  try {
    const payload = (await client.query({
      data: {
        query: getCollectionQuery,
        variables: {
          id,
        },
      },
    })) as GetCollectionQuery;

    return payload.body.data.collection;
  } catch (error) {
    throw error;
  }
};

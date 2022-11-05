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

/**
 * @typedef UpdateCollectionQuery
 * @type {object}
 * @property {object} body
 * @property {object} body.data
 * @property {object} body.data.collectionUpdate
 * @property {Collection} body.data.collectionUpdate.collection
 */
const updateCollectionQuery = `
  mutation collectionUpdate($input: CollectionInput!, $namespace: String!) {
    collectionUpdate(input: $input)
    {
      collection {
        id
        title
        products(first: 20) {
          nodes {
            title
            id
          }
        }
        metafields(first: 1, namespace: $namespace) {
          nodes {
            id
            namespace
            key
            value
          }
        }
      }
    }
  }
`;

interface GetCollection {
  session: Session;
  id: string;
}

export const getCollection = async (session, id): Promise<Collection> => {
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

/**
 * @return {Promise<Collection>}
 * The collections that are updated
 * @param {object} session
 * @param {string} session.shop
 * @param {string} session.accessToken
 * @param {object} input
 * @param {string} input.id - Collection id
 */
export const updateCollections = async (session, input) => {
  const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);
  try {
    const payload: any = await client.query({
      data: {
        query: updateCollectionQuery,
        variables: {
          input: {
            metafields: [
              {
                namespace: "book-appointment",
                key: "category",
                type: "boolean",
                value: "true",
              },
            ],
            ...input,
          },
          namespace: "book-appointment",
        },
      },
    });
    return payload.body.data.collectionUpdate.collection;
  } catch (error) {
    throw error;
  }
};

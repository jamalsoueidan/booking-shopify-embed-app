// @ts-check
import { Shopify } from "@shopify/shopify-api";

/**
 * @typedef Metafield
 * @type {object}
 * @property {string} id
 * @property {string} namespace
 * @property {string} key
 * @property {string} value
 */

/**
 * @typedef Product
 * @type {object}
 * @property {string} id
 * @property {string} title
 */

/**
 * @typedef Collection
 * @type {object}
 * @property {string} id
 * @property {string} title
 * @property {object} products
 * @property {Product[]} products.nodes
 * @property {object} metafields
 * @property {Metafield[]} metafields.nodes
 */

/**
 * @typedef GetCollectionQuery
 * @type {object}
 * @property {object} body
 * @property {object} body.data
 * @property {Collection} body.data.collection
 */
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

/**
 * @return {Promise<Collection>}
 * The collections that are added to the list
 * @param {object} session
 * @param {string} session.shop
 * @param {string} session.accessToken
 * @param {string} id
 */
export const getCollection = async (session, id) => {
  const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);
  try {
    /** @type {GetCollectionQuery} */
    const payload = await client.query({
      data: {
        query: getCollectionQuery,
        variables: {
          id,
        },
      },
    });

    /** @type {Collection[]} */
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
    /** @type {UpdateCollectionQuery} */
    const payload = await client.query({
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

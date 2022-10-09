// @ts-check
import { Shopify } from "@shopify/shopify-api";

const GRAPHQL = `
  query collectionList($first: Int! $namespace: String!) {
    collections(first: $first) {
      nodes {
        id,
        title,
        products(first: 10) {
          nodes {
            title
            id
          }
        }
        metafields(first: 1, namespace: $namespace) {
          nodes {
            id,
            value,
            namespace,
            key
          }
        }
      }
    }
  }
`;

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
 * @typedef QueryCollections
 * @type {object}
 * @property {object} body
 * @property {object} body.data
 * @property {object} body.data.collections
 * @property {Collection[]} body.data.collections.nodes
 */

/**
 * @return {Promise<Collection[]>}
 * The collections that are added to the list
 */
export const getCollections = async (session) => {
  const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);
  try {
    /** @type {QueryCollections} */
    const payload = await client.query({
      data: {
        query: GRAPHQL,
        variables: {
          first: 25,
          namespace: "book-appointment",
        },
      },
    });

    /** @type {Collection[]} */
    const collections = payload.body.data.collections.nodes;
    return collections.filter((c) => {
      return !!c.metafields.nodes.find(
        (m) => m.namespace === "book-appointment"
      );
    });
  } catch (error) {
    throw error;
  }
};

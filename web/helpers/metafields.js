// @ts-check
import { Shopify } from "@shopify/shopify-api";

const getMetafieldsQuery = `
  query metafieldsDefinitions($namespace: String!) {
    metafieldDefinitions(first:1, ownerType:COLLECTION, namespace: $namespace) {
      nodes {
        id,
        namespace,
        key,
        name
      }
    }
  }
`;

const createMetafieldQuery = `
  mutation metafieldDefinitionCreate($input: MetafieldDefinitionInput!){
    metafieldDefinitionCreate(definition: $input) {
      createdDefinition {
        id,
        namespace,
        key,
        name,
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
 * @typedef QueryGetMetafields
 * @type {object}
 * @property {object} body
 * @property {object} body.data
 * @property {object} body.data.metafieldDefinitions
 * @property {Metafield[]} body.data.metafieldDefinitions.nodes
 */

/**
 * @return {Promise<Metafield|undefined>}
 * The metafields that are added to the list
 */
export const getMetafield = async (session) => {
  const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);
  try {
    /** @type {QueryGetMetafields} */
    const payload = await client.query({
      data: {
        query: getMetafieldsQuery,
        variables: {
          namespace: "book-appointment",
        },
      },
    });

    /** @type {Metafield[]} */
    const nodes = payload.body.data.metafieldDefinitions.nodes;
    if (nodes.length > 0) {
      return nodes[0];
    }
    return undefined;
  } catch (error) {
    throw error;
  }
};

/**
 * @typedef QueryCreateMetafields
 * @type {object}
 * @property {object} body
 * @property {object} body.data
 * @property {object} body.data.metafieldDefinitionCreate
 * @property {Metafield|null} body.data.metafieldDefinitionCreate.createdDefinition
 */

/**
 * @return {Promise<Metafield|null>}
 * The metafields that are added to the list
 */
export const createMetafield = async (session) => {
  const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);
  try {
    /** @type {QueryCreateMetafields} */
    const payload = await client.query({
      data: {
        query: createMetafieldQuery,
        variables: {
          input: {
            ownerType: "COLLECTION",
            namespace: "book-appointment",
            key: "category",
            name: "book-appointment-category",
            type: "boolean",
          },
        },
      },
    });

    return payload.body.data.metafieldDefinitionCreate.createdDefinition;
  } catch (error) {
    throw error;
  }
};

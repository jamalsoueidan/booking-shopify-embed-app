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
 * @typedef GetMetafieldQuery
 * @type {object}
 * @property {object} body
 * @property {object} body.data
 * @property {object} body.data.metafieldDefinitions
 * @property {Metafield[]} body.data.metafieldDefinitions.nodes
 */
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

/**
 * @typedef CreateMetafieldQuery
 * @type {object}
 * @property {object} body
 * @property {object} body.data
 * @property {object} body.data.metafieldDefinitionCreate
 * @property {Metafield|null} body.data.metafieldDefinitionCreate.createdDefinition
 */
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

const deleteMetafieldQuery = `
  mutation metafieldDelete($id: ID!){
    metafieldDelete(input: {id: $id}) {
      deletedId
    }
  }
`;

/**
 * @return {Promise<Metafield|undefined>}
 * @param {object} session
 * @param {string} session.shop
 * @param {string} session.accessToken
 * The metafields that are added to the list
 */
export const getMetafield = async (session) => {
  const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);
  try {
    /** @type {GetMetafieldQuery} */
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
 * @return {Promise<Metafield|null>}
 * @param {object} session
 * @param {string} session.shop
 * @param {string} session.accessToken
 * The metafields that are added to the list
 */
export const createMetafield = async (session) => {
  const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);
  try {
    /** @type {CreateMetafieldQuery} */
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

/**
 * @param {object} session
 * @param {string} session.shop
 * @param {string} session.accessToken
 * @param {object} variables
 * @param {string} variables.id
 */
export const deleteMetafield = async (session, variables) => {
  const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);
  try {
    const payload = await client.query({
      data: {
        query: deleteMetafieldQuery,
        variables,
      },
    });
  } catch (error) {
    throw error;
  }
};

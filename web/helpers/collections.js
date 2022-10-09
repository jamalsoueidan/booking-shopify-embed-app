import { Shopify } from "@shopify/shopify-api";

const GRAPHQL = `
  query collectionList($first: Int! $namespace: String!) {
    collections(first: $first) {
      edges {
        node {
          id,
          title,
          products(first: 10) {
            edges {
              node {
                title
                id
              }
            }
          }
          metafields(first: 1, namespace: $namespace) {
            edges {
              node {
                id,
                value,
                namespace,
                key
              }
            }
          }
        }
      }
    }
  }
`;

export default async function collectionsList(session) {
  const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);
  try {
    const payload = await client.query({
      data: {
        query: GRAPHQL,
        variables: {
          first: 25,
          namespace: "book-appointment",
        },
      },
    });
    return payload.body;
  } catch (error) {
    throw error;
  }
}

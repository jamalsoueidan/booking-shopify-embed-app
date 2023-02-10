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
  session: Partial<any>,
  id: string,
): Promise<Collection> => {
  /*const countData = await shopify.api.rest.Collection..count({
    session: res.locals.shopify.session,
  });

  const payload: GetCollectionQuery = await client.query({
    data: {
      query: getCollectionQuery,
      variables: {
        id,
      },
    },
  });

  return payload.body.data.collection;*/
  return [] as any;
};

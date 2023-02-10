import {
  ControllerProps,
  CustomerModel,
  CustomerServiceFind,
  ShopifySessionModel,
} from "@jamalsoueidan/pkg.bsb";
import Shopify from "@shopify/shopify-api";

interface GetQuery {
  name: string;
}

export const get = ({ query }: ControllerProps<GetQuery>) => {
  const { shop, name } = query;
  return CustomerServiceFind({ shop, name });
};

const getCustomerQuery = `
  query($id: ID!) {
    customer(id: $id) {
      firstName
      lastName
      email
      phone
    }
  }
`;

interface FindCustomerAndUpdateProps {
  shop: string;
  customerGraphqlApiId: string;
  customerId: number;
}

export const findCustomerAndUpdate = async ({
  query,
}: ControllerProps<FindCustomerAndUpdateProps>) => {
  const { shop, customerGraphqlApiId, customerId } = query;
  // customer saving
  const session = await ShopifySessionModel.findOne({ shop: shop });

  const client = new Shopify.Clients.Graphql(
    session?.shop || "",
    session?.accessToken,
  );
  const customerData: any = await client.query({
    data: {
      query: getCustomerQuery,
      variables: {
        id: customerGraphqlApiId,
      },
    },
  });

  return await CustomerModel.findOneAndUpdate(
    { customerId, shop },
    {
      customerId,
      shop,
      ...customerData.body.data.customer,
    },
    { upsert: true, new: true },
  );
};

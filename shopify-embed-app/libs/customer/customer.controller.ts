import {
  ControllerProps,
  CustomerModel,
  CustomerServiceFind,
  ShopifyControllerProps,
  ShopifySessionModel,
} from "@jamalsoueidan/pkg.bsb";
import shopify from "../../shopify.js";

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
}: ShopifyControllerProps<FindCustomerAndUpdateProps>) => {
  const session = await ShopifySessionModel.findOne({ shop: query.shop });

  const { shop, customerGraphqlApiId, customerId } = query;
  // customer saving
  const client = new shopify.api.clients.Graphql({ session } as any);
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

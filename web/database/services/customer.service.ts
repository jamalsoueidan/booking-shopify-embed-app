import CustomerModel from "@models/customer.model";
import ShopifySessions from "@models/shopify-sessions.model";
import Shopify from "@shopify/shopify-api";

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

const findCustomerAndUpdate = async ({
  shop,
  customerGraphqlApiId,
  customerId,
}: FindCustomerAndUpdateProps) => {
  // customer saving
  const session = await ShopifySessions.findOne({ shop: shop });

  const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);
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
    { upsert: true, new: true }
  );
};

export default { findCustomerAndUpdate };

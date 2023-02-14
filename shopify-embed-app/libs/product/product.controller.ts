import {
  ControllerProps,
  ProductModel,
  ProductServiceGetAvailableStaff,
  ProductServiceGetById,
  ProductServiceUpdate,
  ProductServiceUpdateBodyProps,
  ProductServiceUpdateQueryProps,
  ShopQuery,
  ShopifyControllerProps,
} from "@jamalsoueidan/pkg.bsb";
import shopify from "../../shopify.js";

interface GetOrderFromShopify {
  id: string;
}

interface ClientQueryShopifyOrder {
  body: {
    data: {
      order: {
        name: string;
      };
    };
  };
}

export const getOrderFromShopify = async ({
  query,
  session,
}: ShopifyControllerProps<GetOrderFromShopify>) => {
  const client = new shopify.api.clients.Graphql({ session } as any);
  const data: ClientQueryShopifyOrder = await client.query({
    data: `query {
      order(id: "gid://shopify/Order/${query.id}") {
        name,
        note,
      }
    }`,
  });
  return data?.body?.data?.order;
};

export const get = ({ query }: ControllerProps<ShopQuery>) => {
  return ProductModel.find({ shop: query.shop });
};

interface Query {
  id: string;
}

export const getById = async ({ query }: ControllerProps<Query>) =>
  ProductServiceGetById(query);

export const update = ({
  query,
  body,
}: ControllerProps<
  ProductServiceUpdateQueryProps,
  ProductServiceUpdateBodyProps
>) => ProductServiceUpdate(query, body);

export const getAvailableStaff = ({ query }: ControllerProps<ShopQuery>) =>
  ProductServiceGetAvailableStaff(query.shop);

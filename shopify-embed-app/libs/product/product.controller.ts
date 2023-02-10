import {
  ControllerProps,
  ProductModel,
  ProductServiceGetById,
  ProductServiceGetStaff,
  ProductServiceUpdate,
  ProductUpdateBody,
  ShopQuery,
  ShopifyControllerProps,
} from "@jamalsoueidan/pkg.bsb";
import { z } from "zod";

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
  /*const client = new Shopify.Clients.Graphql(session.shop, session.accessToken);
  const data: ClientQueryShopifyOrder = await client.query({
    data: `query {
      order(id: "gid://shopify/Order/${query.id}") {
        name,
        note,
      }
    }`,
  });
  return data?.body?.data?.order;*/
  return [];
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
}: ControllerProps<Query, ProductUpdateBody>) =>
  ProductServiceUpdate(query, body);

const BookingServiceUpdateQuerySchema = z.object({
  _id: z.string(),
});

type test = z.infer<typeof BookingServiceUpdateQuerySchema>;

// @description return all staff that don't belong yet to the product
export const getStaff = ({ query }: ControllerProps<ShopQuery>) =>
  ProductServiceGetStaff(query.shop);

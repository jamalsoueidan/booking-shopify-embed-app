import {
  CollectionServiceCreate,
  CollectionServiceCreateBodyProps,
  CollectionServiceDestroy,
  CollectionServiceDestroyProps,
  CollectionServiceGetAll,
  ShopifyControllerProps,
} from "@jamalsoueidan/pkg.bsb";
import shopify from "../../shopify";

export const create = async ({
  body,
  session,
}: ShopifyControllerProps<null, CollectionServiceCreateBodyProps>) =>
  CollectionServiceCreate({ session, shopify }, body);

export const destroy = async ({
  query,
}: ShopifyControllerProps<CollectionServiceDestroyProps>) =>
  CollectionServiceDestroy(query);

export const get = () => CollectionServiceGetAll();

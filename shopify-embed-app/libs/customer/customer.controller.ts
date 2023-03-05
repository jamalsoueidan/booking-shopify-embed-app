import {
    ControllerProps,
    CustomerServiceFindAndUpdate,
    CustomerServiceFindAndUpdateProps,
    CustomerServiceSearch,
    CustomerServiceSearchProps,
    ShopifyControllerProps,
} from "@jamalsoueidan/pkg.backend";
import shopify from "../../shopify.js";

export const get = ({ query }: ControllerProps<CustomerServiceSearchProps>) => {
  return CustomerServiceSearch(query);
};

export const findCustomerAndUpdate = async ({
  query,
}: ShopifyControllerProps<CustomerServiceFindAndUpdateProps>) => {
  return CustomerServiceFindAndUpdate({ ...query, shopify });
};

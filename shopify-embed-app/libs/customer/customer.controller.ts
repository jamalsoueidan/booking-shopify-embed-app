import customerService from "@services/customer.service";

export enum ControllerMethods {
  get = "get",
}

interface GetQuery {
  shop: string;
  name: string;
}

const get = ({ query }: { query: GetQuery }) => {
  const { shop, name } = query;
  return customerService.findCustomer({ shop, name });
};

export default { get };

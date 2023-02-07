import {
  ControllerProps,
  CustomerServiceFind,
} from "@jamalsoueidan/bsb.bsb-pkg";

interface GetQuery {
  name: string;
}

export const get = ({ query }: ControllerProps<GetQuery>) => {
  const { shop, name } = query;
  return CustomerServiceFind({ shop, name });
};

import {
  BookingServiceCreate,
  BookingServiceGetAll,
  BookingServiceGetById,
  BookingServiceUpdate,
  ControllerProps,
  ShopQuery,
} from "@jamalsoueidan/bsb.bsb-pkg";

export interface GetBookingsProps extends BookingQuery, ShopQuery {}

export const get = ({ query }: ControllerProps<GetBookingsProps>) => {
  return BookingServiceGetAll(query);
};

export const create = ({
  query,
  body,
}: ControllerProps<ShopQuery, BookingBodyCreate>) => {
  const shop = query.shop;
  return BookingServiceCreate({ ...body, shop });
};

interface GetByIdProps {
  id: string;
  shop: string;
}

export const getById = ({ query }: ControllerProps<GetByIdProps>) => {
  return BookingServiceGetById(query);
};

export const update = ({
  query,
  body,
}: ControllerProps<GetByIdProps, BookingBodyUpdate>) => {
  const { shop, id } = query;
  return BookingServiceUpdate({ filter: { shop, _id: id }, body });
};

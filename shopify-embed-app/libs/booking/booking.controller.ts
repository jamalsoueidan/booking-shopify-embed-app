import {
  BookingServiceCreate,
  BookingServiceCreateProps,
  BookingServiceGetAll,
  BookingServiceGetAllProps,
  BookingServiceGetById,
  BookingServiceGetByIdProps,
  BookingServiceUpdate,
  BookingServiceUpdateProps,
  ControllerProps,
  ShopQuery,
} from "@jamalsoueidan/pkg.bsb";

export const getAll = ({ query }: ControllerProps<BookingServiceGetAllProps>) =>
  BookingServiceGetAll(query);

export const create = ({
  query,
  body,
}: ControllerProps<ShopQuery, BookingServiceCreateProps>) =>
  BookingServiceCreate({ ...body, shop: query.shop });

export const getById = ({
  query,
}: ControllerProps<BookingServiceGetByIdProps>) => BookingServiceGetById(query);

export const update = ({
  query,
  body,
}: ControllerProps<
  BookingServiceUpdateProps["query"],
  BookingServiceUpdateProps["body"]
>) => BookingServiceUpdate(query, body);

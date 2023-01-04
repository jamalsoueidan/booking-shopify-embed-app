import BookingService from "@services/booking.service";
import { GetBookingsProps } from "./booking.types";

export enum ControllerMethods {
  get = "get",
  getById = "getById",
  update = "update",
  create = "create",
}

interface GetQuery {
  query: GetBookingsProps;
}

const get = ({ query }: GetQuery) => {
  return BookingService.getBookings(query);
};

interface CreateProps {
  query: { shop: string };
  body: BookingBodyCreate;
}

const create = ({ query, body }: CreateProps) => {
  const shop = query.shop;
  return BookingService.create({ ...body, shop });
};

const getById = async ({ query, body }) => {
  return await BookingService.getById(query);
};

interface UpdateProps {
  query: { id: string; shop: string };
  body: BookingBodyUpdate;
}

const update = async ({ query, body }: UpdateProps) => {
  const { shop, id } = query;
  return await BookingService.update({ filter: { shop, _id: id }, body });
};

export default { update, get, getById, create };

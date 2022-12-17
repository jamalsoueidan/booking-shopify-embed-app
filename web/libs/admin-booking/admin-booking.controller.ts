import BookingService from "@services/booking.service";
import { GetBookingsProps } from "./admin-booking.types";

export enum ControllerMethods {
  get = "get",
  getById = "getById",
  update = "update",
}

interface GetQuery {
  query: GetBookingsProps;
}

const get = ({ query }: GetQuery) => {
  return BookingService.getBookings(query);
};

const getById = async ({ query, body }) => {
  return await BookingService.getById(query);
};

const update = async ({ query, body }) => {
  const { shop, id } = query;
  return await BookingService.update({ filter: { shop, _id: id }, body });
};

export default { update, get, getById };

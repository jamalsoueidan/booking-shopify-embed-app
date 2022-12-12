import BookingService from "@services/booking.service";

export enum ControllerMethods {
  get = "get",
  getById = "getById",
  update = "update",
}

const get = async ({ query }) => {
  return await BookingService.getBookings(query);
};

const getById = async ({ query, body }) => {
  return await BookingService.getById(query);
};

const update = async ({ query, body }) => {
  const { shop, id } = query;
  return await BookingService.update({ filter: { shop, _id: id }, body });
};

export default { update, get, getById };
